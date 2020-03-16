const initOptions = {}
const pgp = require('pg-promise')(initOptions);
const config = require('./config.json');

const db = pgp(config.db);

// Exporting the database object for shared use:
module.exports = db;