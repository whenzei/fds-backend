const postgresDB = require('./posgresDB')

async function createDB(dbName) {
    await postgresDB.none("CREATE DATABASE " + dbName)
    console.log(dbName + " created")
}

if (require.main === module) {
    createDB('fds')
}

module.exports = {
    createDB
}