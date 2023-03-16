grammar YASQL

entry Yasql:
    (tables+=Table | inserts+=Insert | selects+=Select)*
;

Table:
    'CREATE' 'TABLE' name=ID '('
        (columns+=ColumnDecl (',' columns+=ColumnDecl)*)?
    ')' ';'
;

ColumnDecl: name=ID ^type=DataType;
ColumnInit: name=ID value=(ID | NUMBER);

Insert:
    'INSERT' 'INTO' table=ID '('
        (columns+=ColumnInit (',' columns+=ColumnInit)*)?
    ')' ';'
;

Select:
    'FROM' table=ID 'SELECT' column=ID ';'
;

DataType returns string: 'text' | 'number';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal NUMBER: /[0-9]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

