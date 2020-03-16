const db = require('../db');
const { Roles } = require('../auth')
const getUsers = function (req, res) {
    db.any('SELECT * FROM Users')
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function (error) {
            res.send(error)
        });
};

async function getRole(uid) {
    let result;
    try {
        result = await db.one(
            `SELECT distinct case
            when exists (select 1 from Customers where uid = '${uid}') then '${Roles.customer}'
            when exists (select 1 from Riders where uid = '${uid}') then '${Roles.rider}'
            when exists (select 1 from Managers where uid = '${uid}') then '${Roles.manager}'
            when exists (select 1 from Staff where uid = '${uid}') then '${Roles.staff}'
            end as role FROM Users;`
        );
    } catch (err) {
        return err;
    }
    return result.role;
}

async function findByUid(uid, callback) {
    let user;
    try {
        user = await db.one(`SELECT * from USERS WHERE uid = ${uid}`);
        user['role'] = await getRole(uid);
    } catch (err) {
        callback(err, null)
        return
    }
    callback(null, user)
    return;
}

async function findByUserName(userName, callback) {
    let user = {};
    try {
        user = await db.one(`SELECT * FROM Users WHERE userName = '${userName}'`);
        user['role'] = await getRole(user.uid)
    } catch (err) {
        callback(err, null)
        return
    }
    callback(null, user);
    return
}

module.exports = {
    getUsers, getRole: getRole, findByUid, findByUserName
}