const db = require('../db');
const UserTypes = require('./user').UserTypes;

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
        await db.one(`SELECT * FROM Customers WHERE uid = '${user.uid}'`);
        user['userType'] = UserTypes.customer
    } catch (err) {
        callback(err, null)
        return
    }
    callback(null, user);
    return
}

module.exports = {
    getCustomers, findByUserName
}