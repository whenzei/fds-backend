const initOptions = {}
const pgp = require('pg-promise')(initOptions);

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
};
const db = pgp(cn);
const dbName = 'fds';
db.none("DROP DATABASE " + dbName)
    .then(data => {
        console.log("Dropped DB " + dbName);
    })
    .catch(error => {
        console.log(error);
    });