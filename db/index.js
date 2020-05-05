const initOptions = {}
const pgp = require('pg-promise')(initOptions);
const { user } = require("./user")

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'fds',
    ...user
};
const db = pgp(cn);

// Exporting the database object for shared use:
module.exports = db;