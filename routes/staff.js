var express = require('express');
var router = express.Router();
const authMiddleWare = require('../auth')

router.all("/", authMiddleWare.authorizeStaff);

router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

module.exports = router;
