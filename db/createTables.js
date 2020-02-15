const db = require('./index')

SQL_CREATE_TABLE_STATEMENTS = {
    "customers": "create table Customers ( " +
        "id                 integer primary key," +
        "userName           varchar(100) not null" +
        ");",

    "riders": "create table Riders ( " +
        "id                 integer primary key," +
        "userName           varchar(100) not null" +
        ");",

    "staff": "create table Staff ( " +
        "id                 integer primary key," +
        "userName           varchar(100) not null" +
        ");",

    "managers": "create table Managers ( " +
        "id                 integer primary key," +
        "userName           varchar(100) not null" +
        ");",
}

for (const [tableName, sqlCommand] of Object.entries(SQL_CREATE_TABLE_STATEMENTS)) {
    db.none(sqlCommand)
        .then(data => {
            console.log(tableName + 'Table created');
        })
        .catch(error => {
            console.log(error);
        });
}