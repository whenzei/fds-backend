const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer')
const passport = require('passport')

// Get all customers
router.get("/", 
    (req, res) => {res.send(req.user)}
);

module.exports = router;