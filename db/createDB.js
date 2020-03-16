const initOptions = {}
const config = require('./config.json');
const pgp = require('pg-promise')(initOptions);

const db = pgp(config.db);
const dbName = 'fds';
db.none("CREATE DATABASE " + dbName)
    .then(data => {
        console.log("CREATE DB " + dbName);
    })
    .catch(error => {
        console.log(error);
    });