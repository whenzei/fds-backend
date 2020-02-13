const express = require('express')
const router = express.Router()
const db = require('./db');

router.get("/", (req, res) => {
    db.any('SELECT * FROM Customers', [true])
    .then(function(data) {
        console.log(data)
        res.status(200).send(data);
    })
    .catch(function(error) {
        res.send(error)
    });
});

module.exports = router;