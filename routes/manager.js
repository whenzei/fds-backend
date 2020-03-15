var express = require('express');
var router = express.Router();
const UserTypes = require('../controllers/user').UserTypes

router.all("/", (req, res, next) => {
    if (!req.user || req.user.userType != UserTypes.manager) {
        res.send(401, 'This page is for logged in managers')
    }
    else {
        next()
    }
});

module.exports = router;
