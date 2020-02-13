const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer')

// Get all customers
router.get("/", customerController.getCustomers);

module.exports = router;