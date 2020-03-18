const db = require('../db');
const getAddressesByUid = async (uid) => {
    const addresses = await db.any(`SELECT * FROM Frequents NATURAL JOIN Address WHERE uid = ${uid}`)
    return addresses
};

module.exports = {
    getAddressesByUid
}