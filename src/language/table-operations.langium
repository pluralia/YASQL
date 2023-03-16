import './terminals'

ColumnInit: name=ID value=(ID | NUMBER);

Insert:
    'INSERT' 'INTO' table=ID '('
        (columns+=ColumnInit (',' columns+=ColumnInit)*)?
    ')' ';'
;

Select:
    'FROM' table=ID 'SELECT' column=ID ';'
;