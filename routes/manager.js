var express = require('express');
var router = express.Router();
const authMiddleWare = require('../auth')

router.all("/", authMiddleWare.authorizeManager);

module.exports = router;
