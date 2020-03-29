const express = require('express');
const router = express.Router();
const { getFullTimeSchedule } = require('../controllers/rider')

router.get("/", (req, res) => {
    res.send(req.user);
})

router.get("/schedule", async function (req, res, next) {
    try {
        return res.send(await getFullTimeSchedule(req.user.uid))
    } catch (e) {
        return next(e)
    }
})

module.exports = router;
