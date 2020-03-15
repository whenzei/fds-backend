const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/user')
const _ = require('lodash')

// Get all customers
router.post('/',
    passport.authenticate(['customer-local', 'rider-local', 'staff-local', 'manager-local']),
    async function (req, res) {
        const user = _.omit(req.user, ['password'])
        console.log(user)
        user['type'] = await userController.getUserType(req.user.uid);
        res.send(user);
    }
);
//, 'rider-local', 'staff-local', 'manager-local'
module.exports = router;