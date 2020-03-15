var express = require('express');
var router = express.Router();
const UserTypes = require('../controllers/user').UserTypes

router.all("/", (req, res, next) => {
    if (!req.user || req.user.userType != UserTypes.staff) {
        res.send(401, 'This page is for logged in staff')
    }
    else {
        next()
    }
});

module.exports = router;
