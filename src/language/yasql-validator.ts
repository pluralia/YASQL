import { MultiMap, ValidationAcceptor, ValidationChecks } from 'langium';
import { ColumnInit, Table, Yasql, YasqlAstType } from './generated/ast';
import type { YasqlServices } from './yasql-module';

export function registerValidationChecks(services: YasqlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.YasqlValidator;
    const checks: ValidationChecks<YasqlAstType> = {
        Table: [
            validator.checkTableStartsWithCapital,
            validator.checkNoEmptyTables
        ],
        Yasql: validator.checkNoTableNameDuplication,
        ColumnInit: validator.checkTypesOfColumnValues,
    };
    registry.register(checks, validator);
}

export class YasqlValidator {

    checkTableStartsWithCapital(table: Table, accept: ValidationAcceptor): void {
        if (table.name) {
            const firstChar = table.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Table name should start with a capital.', { node: table, property: 'name' });
            }
        }
    }
    
    checkNoEmptyTables(table: Table, accept: ValidationAcceptor): void {
        if (table.columns.length === 0) {
            accept('error', 'Table has to contain at least one column.', { node: table, property: 'name' })
        }
    }

    checkNoTableNameDuplication(yasql: Yasql, accept: ValidationAcceptor): void {
        const nameToTables = new MultiMap<string, Table>();
        for (const table of yasql.tables) {
            nameToTables.add(table.name, table);
        }
        
        for (const [, tables] of nameToTables.entriesGroupedByKey()) {
            if (tables.length > 1) {
                tables.forEach(table =>
                    accept('error', 'Table name has to be unique.', { node: table, property: 'name' })
                );
            }
        }
    }

    checkTypesOfColumnValues(columnInit: ColumnInit, accept: ValidationAcceptor): void {
        const column = columnInit.column.ref;
        if (column) {
            if (column.type === 'text' && this.isNumber(columnInit.value)) {
                accept(
                    'error',
                    `Value of the column '${column.name}' has to be text and not number.`,
                    { node: columnInit, property: 'value' }
                );
            }   
        }
    }

    private isNumber(value: string) {
        return /^[0-9]+$/.test(value);
    }

}
