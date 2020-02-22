const express = require('express')
const router = express.Router()
const passport = require('passport')

// Get all customers
router.post('/',
    passport.authenticate('customer-local'),
    function (req, res) {
        res.send(true);
    }
);

module.exports = router;