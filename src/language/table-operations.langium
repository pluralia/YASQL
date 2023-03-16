import './terminals'
import './yasql'

ColumnInit: column=[ColumnDecl:ID] value=(ID | NUMBER);

Insert:
    'INSERT' 'INTO' table=[Table:ID] '('
        (columns+=ColumnInit (',' columns+=ColumnInit)*)?
    ')' ';'
;

Select:
    'FROM' table=[Table:ID] 'SELECT' column=[ColumnDecl:ID] ';'
;
