const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer')
const passport = require('passport')

// Get all customers
router.get("/", passport.authenticate('customer-local'),
(req, res) => {
    console.log(req.user)
    res.send(200);
});

module.exports = router;