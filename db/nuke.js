const { createDB } = require('./createDB')
const { dropDB } = require('./dropDB')
const { init } = require('./initSchema')
const { fill, setNextSerialKeys } = require('./fillTables')

async function main() {
    try {
        await dropDB('fds');
        await createDB('fds');
        await init();
        await fill();
        await setNextSerialKeys();
    } catch (e) {
        console.log("Nuke stoped")
        console.log(e)
        process.exit()
    }
}

if (require.main === module) {
    main().then(() => {
        console.log("Data reset complete")
        process.exit()
    })
}