import {
    DefaultScopeProvider, LangiumServices, ReferenceInfo, Scope
} from 'langium';
import { isColumnInit, isSelect } from './generated/ast';

export class YasqlScopeProvider extends DefaultScopeProvider {

    constructor(services: LangiumServices) {
        super(services);
    }

    override getScope(context: ReferenceInfo): Scope {
        const container = context.container;
        if (isColumnInit(container)) {
            const insertOp = container.$container;
            const table = insertOp.table.ref;
            if (table) {
                return this.createScopeForNodes(table.columns);
            }
        } else if (isSelect(container) && context.property === 'column') {
            const table = container.table.ref;
            if (table) {
                return this.createScopeForNodes(table.columns);
            }
        }
        return super.getScope(context);
    }
}
