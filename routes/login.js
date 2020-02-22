const express = require('express')
const router = express.Router()
const passport = require('passport')
const _ = require('lodash')

// Get all customers
router.post('/',
    passport.authenticate('customer-local'),
    function (req, res) {
        res.send(_.omit(req.user, ['password']));
    }
);

module.exports = router;