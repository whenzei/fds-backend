var express = require('express');
var router = express.Router();
const { getRestaurantId, getTotalOrdersAndCost, getMinMaxDate, getTop5Food } = require('../controllers/staff');
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
        console.log
        try {
            dates = await getMinMaxDate();
        } catch (err) {
            return next(err)
        }
        return res.send(dates);
    });

    router.get("/top-food",
    [
        check('rid').isInt(),
        check('mth').isInt(),
        check('yr').isInt()
    ],
    validate
    , async (req, res, next) => {
        let foodList = [];
        try {
            foodList = await getTop5Food(req.query.rid, req.query.mth, req.query.yr);
        } catch (err) {
            return next(err)
        }
        return res.send(foodList);
    });

module.exports = router;
