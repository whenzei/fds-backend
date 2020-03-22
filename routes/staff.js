var express = require('express');
var router = express.Router();
const { getRestaurantId, getTotalOrdersAndCost, getMinMaxDate, getFoodCount } = require('../controllers/staff');
const { check } = require('express-validator');
const { validate } = require('../validate');

router.get("/", (req, res) => {console.log(req.user); res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`)});

router.get("/get-rid", async (req, res, next) => {
    let rid;
    try {
        rid = await getRestaurantId(req.user.uid);
    } catch (err) {
        return next(err);
    }
    return res.send(rid);
});

router.get("/order-summary/:rid",
    [
        check('rid').isInt()
    ],
    validate
    , async (req, res, next) => {
        let orderStatistics;
        try {
            orderStatistics = await getTotalOrdersAndCost(req.params.rid);
        } catch (err) {
            return next(err)
        }
        return res.send(orderStatistics);
    });

    router.get("/min-max-date", async (req, res, next) => {
        let dates = [];
        try {
            dates = await getMinMaxDate();
        } catch (err) {
            return next(err)
        }
        return res.send(dates);
    });

    router.get("/food-count",
    [
        check('rid').isInt(),
        check('mth').isInt(),
        check('yr').isInt(),
        check('isDesc').isBoolean(),
        check('limit').isInt()
    ],
    validate
    , async (req, res, next) => {
        let foodList = [];
        try {
            foodList = await getFoodCount(req.query.rid, req.query.mth, req.query.yr, req.query.isDesc, req.query.limit);
        } catch (err) {
            return next(err)
        }
        return res.send(foodList);
    });

module.exports = router;
