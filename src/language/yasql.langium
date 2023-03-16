grammar YASQL

import './table-operations'
import './terminals'

entry Yasql:
    (tables+=Table | inserts+=Insert | selects+=Select)*
;

Table:
    'CREATE' 'TABLE' name=ID '('
        (columns+=ColumnDecl (',' columns+=ColumnDecl)*)?
    ')' ';'
;

ColumnDecl: name=ID ^type=DataType;

DataType returns string: 'text' | 'number';
