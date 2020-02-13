const db = require('../db');

exports.getCustomers = function (req, res) {
    db.any('SELECT * FROM Customers', [true])
        .then(function (data) {
            console.log(data)
            res.status(200).send(data);
        })
        .catch(function (error) {
            res.send(error)
        });
};