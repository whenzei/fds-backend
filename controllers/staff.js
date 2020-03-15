const db = require('../db');
const UserTypes = require('./user').UserTypes;

const getStaff = function (req, res) {
    db.any('SELECT * FROM Staff')
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
        await db.one(`SELECT * FROM Staff WHERE uid = '${user.uid}'`);
        user['userType'] = UserTypes.staff;
    } catch (err) {
        callback(err, null)
        return
    }
    callback(null, user);
    return
}

module.exports = {
    getStaff, findByUserName
}