# YASQL

YASQL -- Yet Another SQL -- a small subset of SQL that allows add tables, fill tables and select columns

### The YASQL Example
```
CREATE TABLE Languages (
    year number,
    name text
);

INSERT INTO Languages (
    year 2012,
    name TypeScript
);

INSERT INTO Languages (
    year 1995,
    name Java
);

FROM Languages SELECT name;
```

## Getting Started
```
cd YASQL
npm i
npm run langium:generate
npm run build
```
## Start VSCode extension
* Press the button `Run YASQL Extension`
<img width="1512" alt="Screenshot 2023-03-17 at 15 35 14" src="https://user-images.githubusercontent.com/15619772/225935392-28e477c6-80d7-4dee-9aec-4a65f1785873.png">

## Start web-app
* Press the button `Deb Chrome Debugging`
<img width="1512" alt="Screenshot 2023-03-17 at 15 34 59" src="https://user-images.githubusercontent.com/15619772/225935507-1d82068d-d222-4514-9fb4-a32dffcf39f1.png">

## Run CLI (on the example above)
```
./bin/cli generate examples/lang_table.yasql
```