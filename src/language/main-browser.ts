import { EmptyFileSystem, startLanguageServer } from 'langium';
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from 'vscode-languageserver/browser';
import { createYasqlServices } from './yasql-module';

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared } = createYasqlServices({ connection, ...EmptyFileSystem });

startLanguageServer(shared);
