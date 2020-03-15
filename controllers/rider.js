const db = require('../db');

const getRiders = function (req, res) {
    db.any('SELECT * FROM Riders')
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
        await db.one(`SELECT * FROM Riders WHERE uid = '${user.uid}'`);
    } catch (err) {
        callback(err, null)
        return
    }
    callback(null, user);
    return
}

module.exports = {
    getRiders, findByUserName
}