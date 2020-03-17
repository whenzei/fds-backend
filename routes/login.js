const express = require('express')
const router = express.Router()
const passport = require('passport')
const _ = require('lodash')
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require("../auth/strategies")

router.post('/',
    passport.authenticate('local', {session: false}),
    async (req, res) => {
        const user = _.omit(req.user, ['password'])
        const token = jwt.sign(user, JWT_SECRET_KEY);
        return res.json({user, token});
    }
);
module.exports = router