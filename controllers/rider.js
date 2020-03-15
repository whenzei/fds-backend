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

async function findByUserName(userName) {
    let user = {};
    try {
        user = await db.one(`SELECT * FROM Riders WHERE username = '${userName}'`);
    } catch (err) {
        return null;
    }
    return user;
}

module.exports = {
    getRiders, findByUserName
}