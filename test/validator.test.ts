import { EmptyFileSystem } from 'langium';
import { parseHelper } from 'langium/test';
import { describe, expect, test } from 'vitest';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { Yasql } from '../src/language/generated/ast';
import { createYasqlServices } from '../src/language/yasql-module';

const yasqlServices = createYasqlServices(EmptyFileSystem).Yasql;
const parseProgram = parseHelper<Yasql>(yasqlServices);

describe('verify no validation errors', () => {

    test('', async () => {
        const prog = `
        CREATE TABLE Languages (
            year number,
            name text
        );
        `.trim();
        verifyNoErrors(prog);
    });

    test('', async () => {
        const prog = `
        CREATE TABLE Languages (
            year number,
            name text
        );
        
        INSERT INTO Languages (
            year 2012,
            name TypeScript
        );
        `.trim();
        verifyNoErrors(prog);
    });
});

async function verifyNoErrors(program: string) {
    const document = await parseProgram(program);
    let diagnostics: Diagnostic[] = await yasqlServices.validation.DocumentValidator.validateDocument(document);
    diagnostics = diagnostics.filter(d => d.severity === DiagnosticSeverity.Error);
    expect(diagnostics).toHaveLength(0);
}