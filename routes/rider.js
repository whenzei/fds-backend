const express = require('express');
const router = express.Router();
const { getFullTimeSchedule } = require('../controllers/rider')
const { check } = require('express-validator');
const { validate } = require('../validate')
router.get("/", (req, res) => {
    res.send(req.user);
})

router.get("/schedule/:year/:month",
    [
        check('year').isInt({ min: 2010 }),
        check('month').isInt({ min: 1, max: 12 })
    ],
    validate
    , async function (req, res, next) {
        try {
            return res.send(await getFullTimeSchedule(req.user.uid, req.params.year, req.params.month))
        } catch (e) {
            return next(e)
        }
    })

module.exports = router;
