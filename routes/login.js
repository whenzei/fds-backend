const express = require('express')
const router = express.Router()
const passport = require('passport')
const _ = require('lodash')

// Get all customers
router.post('/',
    passport.authenticate('customer-local'),
    function (req, res) {
        const user = _.omit(req.user, ['password'])
        user['type'] = "customer"
        res.send(user);
    }
);

module.exports = router;