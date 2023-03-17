import { AbstractSemanticTokenProvider, AstNode, SemanticTokenAcceptor } from 'langium';
import { SemanticTokenTypes } from 'vscode-languageserver';
import { isColumnDecl, isColumnInit, isSelect } from './generated/ast';

export class YasqlSemanticTokenProvider extends AbstractSemanticTokenProvider {

    protected highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void {
        if (isColumnDecl(node)) {
            acceptor({
                node,
                property: 'type',
                type: SemanticTokenTypes.type
            });
            acceptor({
                node,
                property: 'name',
                type: SemanticTokenTypes.property
            });
        } else if (isColumnInit(node) || isSelect(node)) {
            acceptor({
                node,
                property: 'column',
                type: SemanticTokenTypes.parameter
            });
        }
    }

}