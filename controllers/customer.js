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

async function findByUserName(userName, callback) {
    let user = {};
    try {
        user = await db.one(`SELECT * FROM Users WHERE userName = '${userName}'`);
        customer = await db.one(`SELECT * FROM Customers WHERE uid = '${user.uid}'`);
        if (!customer) throw (userName + " not a customer")
    } catch (err) {
        callback(err, null)
    }
    callback(null, user);
}

module.exports = {
    getCustomers, findByUserName
}