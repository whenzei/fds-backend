const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/user')
const _ = require('lodash')

router.post('/',
    passport.authenticate(['customer-local', 'rider-local', 'staff-local', 'manager-local']),
    async (req, res) => {
        const user = _.omit(req.user, ['password'])
        user['userType'] = await userController.getUserType(req.user.uid);
        res.send(user);
    }
);
module.exports = router;