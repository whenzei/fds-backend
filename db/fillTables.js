const db = require('./index')

SQL_CREATE_TABLE_STATEMENTS = {
    "customers": "insert into Customers (id, username, password) Values" +
        "(1, 'lalala', '123')," +
        "(2, 'blablabla', '321');",

    "riders": "insert into Riders (id, username, password) Values" +
    "(3, '123', 'abc')," +
    "(4, '321', 'asd');",

    "staff": "insert into Staff (id, username, password) Values" +
    "(5, 'a', 'pen')," +
    "(6, 'b', '15');",

    "managers": "insert into Managers (id, username, password) Values" +
    "(7, 'c', '123')," +
    "(8, 'd', '321');"
}
promises = []
for (const [tableName, sqlCommand] of Object.entries(SQL_CREATE_TABLE_STATEMENTS)) {
    promises.push(new Promise((resolve, reject) =>
        db.none(sqlCommand)
            .then(data => {
                console.log(tableName + ' rows added');
            })
            .catch(error => {
                console.log(error);
            })
    ))
}

Promise.all(promises)