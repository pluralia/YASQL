import fs from 'fs';
// import { CompositeGeneratorNode, NL, toString } from 'langium';
import { expandToNode as toNode, joinToNode as join, Generated, toString } from 'langium';
import path from 'path';
import { Insert, Select, Table, Yasql } from '../language/generated/ast';
import { extractDestinationAndName } from './cli-util';

export function generateSQL(yasql: Yasql, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.sql`;

    const fileNode = convertYasql(yasql);

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

function convertYasql(yasql: Yasql): Generated {
    return toNode`
        ${covertTables(yasql.tables)}
        ${convertInserts(yasql.inserts)}
        ${convertSelects(yasql.selects)}
    `;
}

function covertTables(tables: Table[]): Generated {
    return toNode`${join(tables, table => toNode`
        CREATE TABLE ${table.name} (
            ${join(table.columns, column => toNode`
                ${column.name.toUpperCase()} ${column.type === 'text' ? 'VARCHAR(255)' : 'INT'}
            `,
            { separator: ',', appendNewLineIfNotEmpty: true })}
        );`
        .appendNewLine().appendNewLine()
    )}`;
}

function convertInserts(inserts: Insert[]) {
    return toNode`${join(inserts, insert => toNode`
        INSERT INTO ${insert.table.ref?.name} (${insert.columns.map(e => e.column.ref?.name?.toUpperCase()).join(', ')})
        VALUES (${insert.columns.map(e => e.column.ref?.type === 'text' ? `'${e.value}'` : e.value).join(', ')});`
        .appendNewLine().appendNewLine(),
    )}`;
}

function convertSelects(selects: Select[]) {
    return toNode`${join(selects, select => toNode`
        SELECT ${select.column.ref?.name} FROM ${select.table.ref?.name}
    `
    .appendNewLine().appendNewLine(),
    )}`;
}
