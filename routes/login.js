const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/user')
const _ = require('lodash')

// Get all customers
router.post('/',
    passport.authenticate(['customer-local', 'rider-local']),
    async function (req, res) {
        const user = _.omit(req.user, ['password'])
        user['type'] = await userController.getUserType(req.user.username);
        res.send(user);
    }
);

module.exports = router;