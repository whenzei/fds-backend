const express = require('express')
const router = express.Router()
const passport = require('passport')
const _ = require('lodash')
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../auth/strategies")
const { check } = require('express-validator')
const { validate } = require('../validate')
const {Roles} = require('../auth')
const {getRiderType} = require("../controllers/rider")

router.post('/',
    [
        check('username').trim().escape().not().isEmpty(),
        check('password').trim().escape().not().isEmpty()
    ]
    , validate,
    passport.authenticate('local', { session: false }),
    async (req, res) => {
        const user = _.omit(req.user, ['password', 'passwordhash', 'salt'])
        const token = jwt.sign({ uid: user.uid }, JWT_SECRET_KEY);
        return res.json({ user, token });
    }
);
module.exports = router