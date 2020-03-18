const db = require('../db');
const {Roles} = require('../auth')

const getCustomers = function (req, res) {
    db.any('SELECT * FROM Customers')
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function (error) {
            res.send(error)
        });
};

async function findByUserName(userName) {
    let user = {};
    try {
        user = await db.one(`SELECT * FROM Users WHERE userName = '${userName}'`);
        await db.one(`SELECT * FROM Customers WHERE uid = '${user.uid}'`);
        user['role'] = Roles.customer
    } catch (err) {
        throw Error("Cannot retrieve customer")
    }
    return user;
}

module.exports = {
    getCustomers, findByUserName
}