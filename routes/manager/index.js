var router = require('express').Router();

router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

router.use('/orders', require('./orders'));
router.use('/rider', require('./rider'));
module.exports = router;
