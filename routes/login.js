const express = require('express')
const router = express.Router()
const passport = require('passport')
const _ = require('lodash')
const jwt = require('jsonwebtoken');

router.post('/',
    passport.authenticate('local', {session: false}),
    async (req, res) => {
        const user = _.omit(req.user, ['password'])
        const token = jwt.sign(user, 'JWWWWWWTTTSECRET_FANTASY');
        return res.json({user, token});
    }
);
module.exports = router