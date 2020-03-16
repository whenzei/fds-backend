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
db.none("CREATE DATABASE " + dbName)
    .then(data => {
        console.log("CREATE DB " + dbName);
    })
    .catch(error => {
        console.log(error);
    });