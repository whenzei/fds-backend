const express = require('express');
const router = express.Router();
const { getRiderType, getFullTimeSchedule, getStartDaysOfMonth, getShifts, updateFTSchedule, updatePTSchedule } = require('../controllers/rider')
const { check } = require('express-validator');
const { validate } = require('../validate')
const { RiderTypes } = require('../controllers/rider')
const moment = require('moment')

router.get("/rider-type", async (req, res, next) => {
    try {
        const riderType = await getRiderType(req.user.uid)
        return res.send(riderType)
    } catch (e) {
        return next(e)
    }
})

router.get("/schedule/:year/:month",
    [
        check('year').isInt({ min: 2020 }),
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

router.post("/update-pt-schedule",
    [
        check('year').isInt({ min: 2020 }),
        check('week').isInt({ min: 1, max: 53 }),
        check('dailySchedules').isArray().isLength(7)
    ],
    validate,
    async function (req, res, next) {
        if (req.user.riderType != RiderTypes.partTime) {
            return next("Not Part Time rider")
        }
        const year = req.body.year;
        const week = req.body.week;
        const dailySchedules = req.body.dailySchedules;

        // Check future
        const nextWeek = moment(new Date()).add(1, 'week')
        if (year < nextWeek.isoWeekYear() || (year == nextWeek.isoWeekYear() && week < nextWeek.isoWeek())) {
            return next("Too late to update")
        }

        // Check min and max
        const totalHours = dailySchedules.map(x => x.slots).flat().map(y => (y.endTime - y.startTime)).reduce((a, b) => a + b)
        if (totalHours < 10) {
            res.status(422)
            return next("Need to work at least 10 hours in a week")
        }
        else if (totalHours > 48) {
            res.status(422)
            return next("Weekly work hours cannot exceed 48")
        }
        // Update schedule
        try {
            updatePTSchedule(req.user.uid, year, week, dailySchedules)
        } catch (e) {
            return next(e)
        }

        return res.status(201).send()
    }
)


router.post("/update-ft-schedule",
    [
        check('year').isInt({ min: 2020 }),
        check('month').isInt({ min: 1, max: 12 }), // 1 indexed
        check('startDayOfMonth').isInt({ min: 1 }),
        check('firstDayShiftId').isInt(),
        check('secondDayShiftId').isInt(),
        check('thirdDayShiftId').isInt(),
        check('fourthDayShiftId').isInt(),
        check('fifthDayShiftId').isInt(),
    ],
    validate,
    async function (req, res, next) {
        if (req.user.riderType != RiderTypes.fullTime) {
            return next("Not Full Time rider")
        }
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
            await updateFTSchedule(year, month, req.user.uid, startDayOfMonth, shiftIds)
        } catch (e) {
            return next(e)
        }
        return res.status(201).send()
    }
)

router.get("/shifts",
    async (req, res, next) => {
        try {
            let shifts = await getShifts()
            return res.send(shifts)
        } catch (e) {
            return next(e)
        }
    }
)

router.get('/startDaysOfMonths/:year/:month',
    [
        check('year').isInt({ min: 2020 }),
        check('month').isInt({ min: 1, max: 12 })
    ],
    validate,
    async (req, res, next) => {
        try {
            let startDaysOfMonth = await getStartDaysOfMonth(req.params.year, req.params.month)
            return res.send(startDaysOfMonth)
        } catch (e) {
            return next(e)
        }
    }
)

module.exports = router;
