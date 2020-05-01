var express = require('express');
var router = express.Router();
const { getRestaurantInfo, getTotalOrdersAndCost, getMinMaxDate, getFoodCount, getPromoStats, getAllOrders, getRestaurantPromos, insertRestaurantPromos, updateRestaurantPromos, deleteRestaurantPromos } = require('../controllers/staff');
const { getMinSpending, getCuisines, getMenu, insertFoodItem, updateFoodItem, deleteFoodItem, updateMinSpending } = require('../controllers/restaurant')
const { check } = require('express-validator');
const { validate } = require('../validate');

router.get("/", (req, res) => { res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`) });

router.get("/get-restaurant-info", async (req, res, next) => {
    let restaurant_data;
    try {
        restaurant_data = await getRestaurantInfo(req.user.uid);
    } catch (err) {
        return next(err);
    }
    return res.send(restaurant_data);
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

router.get("/food/:rid",
    [
        check('rid').isInt()
    ],
    validate
    , async (req, res, next) => {
        let foodList = [];
        try {
            foodList = await getMenu(req.params.rid);
        } catch (err) {
            return next(err)
        }
        return res.send(foodList);
    });

router.get("/cuisine/", async (req, res, next) => {
    let cuisines = [];
    try {
        cuisines = await getCuisines();
    } catch (err) {
        return next(err)
    }
    return res.send(cuisines);
});

router.get("/min-spending/:rid",
    [
        check('rid').isInt()
    ],
    validate
    , async (req, res, next) => {
        let minSpending;
        try {
            minSpending = await getMinSpending(req.params.rid);
        } catch (err) {
            return next(err)
        }
        return res.send(minSpending);
    });

router.post("/add-food-item/", async (req, res, next) => {
    try {
        await insertFoodItem(req.user.uid, req.body.item);
    } catch (err) {
        return next(err)
    }
    return res.status(200).send('Added food item to menu');
});

router.post("/edit-food-item/", async (req, res, next) => {
    try {
        await updateFoodItem(req.user.uid, req.body.fname, req.body.item);
    } catch (err) {
        return next(err)
    }
    return res.status(200).send("Updated food item");
});

router.delete("/delete-food-item/", async (req, res, next) => {
    try {
        await deleteFoodItem(req.user.uid, req.body.fname);
    } catch (err) {
        return next(err)
    }
    return res.status(200).send('Removed food item');
});

router.post("/update-minspending/", async (req, res, next) => {
    try {
        await updateMinSpending(req.user.uid, req.body.minspending);
    } catch (err) {
        return next(err)
    }
    return res.status(200).send("Updated minimum spending");
});

module.exports = router;
