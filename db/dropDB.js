const initOptions = {}
const pgp = require('pg-promise')(initOptions);
const config = require('./config.json');

const db = pgp(config.db);
const dbName = 'fds';
db.none("DROP DATABASE " + dbName)
    .then(data => {
        console.log("Dropped DB" + dbName);
    })
    .catch(error => {
        console.log(error);
    });