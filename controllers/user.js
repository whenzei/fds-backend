const db = require('../db');
const UserTypes = {
    rider: "Rider", customer: "Customer", staff: "Staff", manager: "Manager"
}
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
            when exists (select 1 from Customers where uid = '${uid}') then '${UserTypes.customer}'
            when exists (select 1 from Riders where uid = '${uid}') then '${UserTypes.rider}'
            when exists (select 1 from Managers where uid = '${uid}') then '${UserTypes.manager}'
            when exists (select 1 from Staff where uid = '${uid}') then '${UserTypes.staff}'
            end as userType FROM Users;`
        );
    } catch (err) {
        console.log(err)
        return err;
    }
    return result.usertype;
}

async function findByUid(uid, callback) {
    let user;
    try {
        user = await db.one(`SELECT * from USERS WHERE uid = ${uid}`);
        user['userType'] = await getUserType(uid);
    } catch (err) {
        callback(err, null)
        return
    }
    callback(null, user)
    return;
}

module.exports = {
    getUsers, getUserType, findByUid, UserTypes
}