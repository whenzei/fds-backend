const db = require('../db');

const getUsers = function (req, res) {
    db.any('SELECT * FROM Users')
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function (error) {
            res.send(error)
        });
};

async function getUserType(uid) {
    let result;
    try {
        result = await db.one(
            `SELECT distinct case
            when exists (select 1 from Customers where uid = '${uid}') then 'Customer'
            when exists (select 1 from Riders where uid = '${uid}') then 'Rider'
            when exists (select 1 from Managers where uid = '${uid}') then 'Manager'
            when exists (select 1 from Staff where uid = '${uid}') then 'Staff'
            end as userType FROM Customers;`
        );
    } catch (err) {
        console.log(err)
    }
    return result.usertype;
}

async function findByUid(uid, callback) {
    let user;
    try {
        user = await db.one(`SELECT * from USERS WHERE uid = ${uid}`);
    } catch (err) {
        callback(err, null)
    }
    callback(null, user);
}

module.exports = {
    getUsers, getUserType, findByUid
}