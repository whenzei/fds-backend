const express = require('express')
const router = express.Router()
const authMiddleWare = require('../auth')

router.all("/", authMiddleWare.authorizeCustomer);

// Get all customers
router.get("/", 
    (req, res) => {res.send(req.user)}
);

module.exports = router;