import chalk from 'chalk';
import { Command } from 'commander';
import { Yasql } from '../language/generated/ast';
import { extractAstNode } from './cli-util';
import { generateSQL } from './generator';
import { NodeFileSystem } from 'langium/node';
import { createYasqlServices } from '../language/yasql-module';
import { YASQLLanguageMetaData } from '../language/generated/module';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createYasqlServices(NodeFileSystem).Yasql;
    const model = await extractAstNode<Yasql>(fileName, services);
    const generatedFilePath = generateSQL(model, fileName, opts.destination);
    console.log(chalk.green(`SQL code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = YASQLLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates SQL code from YASQL in a source file')
        .action(generateAction);

    program.parse(process.argv);
}
