const db = require('../db');

const getCustomers = function (req, res) {
    db.any('SELECT * FROM Customers')
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function (error) {
            res.send(error)
        });
};

async function findByUserName (userName) {
    const user = await db.one(`SELECT * FROM Customers WHERE username = '${userName}'`);
    return user;
}

module.exports = {
    getCustomers, findByUserName
}