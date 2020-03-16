const express = require('express')
const router = express.Router()
const authMiddleWare = require('../auth')

router.all("/", authMiddleWare.authorizeCustomer);

router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

module.exports = router;