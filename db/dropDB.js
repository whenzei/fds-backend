const initOptions = {}
const posgresDb = require('./posgresDB')
async function dropDB(dbName) {
    await posgresDb.none("DROP DATABASE " + dbName)
    console.log(dbName + " dropped")
}

if (require.main === module) {
    dropDB('fds')
}

module.exports = {
    dropDB
}