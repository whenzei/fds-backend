const db = require('../db');
const PS = require('pg-promise').PreparedStatement;

const psGetCustomers = new PS({ name: 'get-customers', text: 'SELECT * FROM Customers' });
const psGetFrequents = new PS({
    name: 'get-frequents',
    text: ` SELECT A.streetName as address, A.unit, A.postalCode as postal
             FROM Frequents F JOIN Address A ON F.addrId = A.addrId
             WHERE F.uid = $1`
})

const getCustomers = async function () {
    return await db.any(psGetCustomers);
};

const getFrequents = async function (uid) {
    return await db.any(psGetFrequents, [uid]);
}

module.exports = {
    getCustomers, getFrequents
}