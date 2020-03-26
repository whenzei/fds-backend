const db = require('../db');
const PS = require('pg-promise').PreparedStatement;

const psGetCustomers = new PS({ name: 'get-customers', text: 'SELECT * FROM Customers' });
const psGetAccountInfo = new PS({
    name: 'get-account-info',
    text: `SELECT name, points, creditCard FROM Customers C JOIN Users U on C.uid = U.uid
            WHERE C.uid = $1`
});
const psGetFrequents = new PS({
    name: 'get-frequents',
    text: ` SELECT A.streetName as address, A.unit, A.postalCode as postal
             FROM Frequents F JOIN Address A ON F.addrId = A.addrId
             WHERE F.uid = $1`
});
const psGetCreditCard = new PS({
    name: 'get-credit-card',
    text: `SELECT creditCard FROM Customers where uid = $1`
});
const psAddCreditCard = new PS({
    name: 'add-credit-card',
    text: `UPDATE Customers set creditCard = $1 WHERE uid = $2`
});
const psRemoveCreditCard = new PS({
    name: 'remove-credit-card',
    text: `UPDATE Customers set creditCard = null WHERE uid = $1`
});

const getCustomers = async function () {
    return await db.any(psGetCustomers);
};

const getFrequents = async function (uid) {
    return await db.any(psGetFrequents, [uid]);
}

const getAccountInfo = async function (uid) {
    return await db.any(psGetAccountInfo, [uid])
}

const addCreditCard = async function (uid, card) {
    const dbData = await db.oneOrNone(psGetCreditCard, [uid])
    if (dbData['creditcard'] === null) {
        await db.none(psAddCreditCard, [card, uid])
    } else {
        throw 500;
    }
}

const removeCreditCard = async function (uid) {
    await db.none(psRemoveCreditCard, [uid]);
}
module.exports = {
    getCustomers, getFrequents, getAccountInfo, addCreditCard, removeCreditCard
}