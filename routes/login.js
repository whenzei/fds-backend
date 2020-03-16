const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/user')
const _ = require('lodash')

router.post('/',
    passport.authenticate('local'),
    async (req, res) => {
        const user = _.omit(req.user, ['password'])
        res.send(user);
    }
);
module.exports = router;