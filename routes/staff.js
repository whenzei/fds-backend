var express = require('express');
var router = express.Router();
const { getRestaurantId, getTotalOrdersAndCost, getMinMaxDate, getFoodCount, getPromoStats, getAllOrders, getRestaurantPromos, insertRestaurantPromos, updateRestaurantPromos, deleteRestaurantPromos } = require('../controllers/staff');
const { check } = require('express-validator');
const { validate } = require('../validate');

router.get("/", (req, res) => { res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`) });

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

router.get("/promo-summary/:rid",
    [
        check('rid').isInt()
    ],
    validate
    , async (req, res, next) => {
        let promoStats = [];
        try {
            promoStats = await getPromoStats(req.params.rid);
        } catch (err) {
            return next(err)
        }
        return res.send(promoStats);
    });

router.get("/get-orders/:rid",
    [
        check('rid').isInt()
    ],
    validate
    , async (req, res, next) => {
        let orderList = [];
        try {
            orderList = await getAllOrders(req.params.rid);
        } catch (err) {
            return next(err)
        }
        return res.send(orderList);
    });

router.get("/promos/:rid",
    [
        check('rid').isInt()
    ],
    validate
    , async (req, res, next) => {
        let promoList = [];
        try {
            promoList = await getRestaurantPromos(req.params.rid);
        } catch (err) {
            return next(err)
        }
        return res.send(promoList);
    });

router.post("/add-promos/", async (req, res, next) => {
        let pid;
        try {
            pid = await insertRestaurantPromos(req.user.uid, req.body.item);
        } catch (err) {
            return next(err)
        }
        return res.status(200).send(pid.toString());
    });

    router.post("/edit-promos/", async (req, res, next) => {
        try {
            await updateRestaurantPromos(req.body.item);
        } catch (err) {
            return next(err)
        }
        return res.status(200).send("Updated promotion");
    });

router.delete("/delete-promos/",
    [
        check('pid').isInt()
    ],
    validate
    , async (req, res, next) => {
        try {
            await deleteRestaurantPromos(req.body.pid, req.user.uid);
        } catch (err) {
            return next(err)
        }
        return res.status(200).send('Promotion removed');
    });

module.exports = router;
