const pgp = require('pg-promise')({});
const { user } = require("./user")
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ...user
};
const db = pgp(cn);

module.exports = db