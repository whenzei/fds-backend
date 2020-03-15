const db = require('../db');

const getManagers = function (req, res) {
    db.any('SELECT * FROM Managers')
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
        await db.one(`SELECT * FROM Managers WHERE uid = '${user.uid}'`);
    } catch (err) {
        callback(err, null)
    }
    callback(null, user);
}

module.exports = {
    getManagers, findByUserName
}