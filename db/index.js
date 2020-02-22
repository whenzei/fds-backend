const initOptions = {}
const pgp = require('pg-promise')(initOptions);
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'fds',
    user: 'postgres',
    password: 'password'
};
const db = pgp(cn);

// Exporting the database object for shared use:
module.exports = db;