const initOptions = {}
const pgp = require('pg-promise')(initOptions);
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'fds',
    user: 'postgres',
    password: 'postgres'
};
const db = pgp(cn);

TABLES_TO_DROP = ["Customers", "Staff", "Riders", "Managers"]

db.none("DROP table " + TABLES_TO_DROP.join(","))
    .then(data => {
        console.log("Dropped tables");
    })
    .catch(error => {
        console.log(error);
    });