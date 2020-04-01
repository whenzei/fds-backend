const express = require('express');
const router = express.Router();
const { getFullTimeSchedule, getStartDaysOfMonth, getShifts, updateSchedule } = require('../controllers/rider')
const { check } = require('express-validator');
const { validate } = require('../validate')
const logger = require('morgan')
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

router.post("/update-schedule",
    [
        check('year').isInt(),
        check('month').isInt({ min: 1, max: 12 }), // 1 indexed
        check('startDayOfMonth').isInt(),
        check('firstDayShiftId').isInt(),
        check('secondDayShiftId').isInt(),
        check('thirdDayShiftId').isInt(),
        check('fourthDayShiftId').isInt(),
        check('fifthDayShiftId').isInt(),
    ],
    validate,
    async function (req, res, next) {
        const shiftIds = [
            req.body.firstDayShiftId,
            req.body.secondDayShiftId,
            req.body.thirdDayShiftId,
            req.body.fourthDayShiftId,
            req.body.fifthDayShiftId,
        ]
        const year = req.body.year
        const month = req.body.month
        const startDayOfMonth = req.body.startDayOfMonth
        // Check future/past
        if (new Date(year, month - 1, 1) < new Date()) {
            res.status(422)
            return next("Too late to update")
        }

        // Check firstDay
        const startDaysOfMonth = getStartDaysOfMonth(year, month)
        if (!startDaysOfMonth.includes(startDayOfMonth)) {
            res.status(422)
            return next(`Start day of month: ${startDayOfMonth}, not valid for ${year} - ${month}`)
        }

        // Check shifts
        const shifts = await getShifts();
        const validShiftIds = shifts.map(shift => shift.shiftid)
        shiftIds.forEach((shiftId) => {
            if (!validShiftIds.includes(shiftId)) {
                res.status(422)
                return next(`No shift id: ${shiftId}`)
            }
        })

        // Insert/Update
        try {
            await updateSchedule(year, month, req.user.uid, startDayOfMonth, shiftIds)
        } catch (e) {
            return next(e)
        }
        return res.status(201).send()
    }
)

module.exports = router;
