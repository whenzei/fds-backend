var express = require('express')
var router = express.Router()


router.get("/", (req, res) => {
    res.status(200).send("HELLO from customer");
});

module.exports = router;