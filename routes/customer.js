const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer')
const passport = require('passport')
const UserTypes = require('../controllers/user').UserTypes

router.all("/", (req, res, next) => {
    if (!req.user || req.user.userType != UserTypes.customer) {
        res.send(401, 'This page is for logged in customers')
    }
    else {
        next()
    }
});

// Get all customers
router.get("/", 
    (req, res) => {res.send(req.user)}
);

module.exports = router;