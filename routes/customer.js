const express = require('express')
const router = express.Router()
const { getMenu, getRestaurants } = require('../controllers/restaurant')
const { getFrequents, getAccountInfo, addCreditCard,
    removeCreditCard, getEligiblePromos } = require('../controllers/customer')
const {addOrder} = require('../controllers/orders')
const { getAddresses } = require('../controllers/addressLookUp')
const { check } = require('express-validator');
const { validate } = require('../validate')

router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

router.get("/restaurants", async (req, res, next) => {
    let restaurants = []
    try {
        restaurants = await getRestaurants();
    } catch (err) {
        return next(err)
    }
    return res.send(restaurants);
})


router.get("/restaurants/:rid",
    [
        check('rid').isInt()
    ],
    validate
    , async (req, res, next) => {
        let menu;
        try {
            menu = await getMenu(req.params.rid);
        } catch (err) {
            return next(err)
        }
        return res.send(menu)
    })

router.get("/addresses/", async (req, res, next) => {
    const searchStr = req.query.search;
    let addresses = [];
    try {
        addresses = getAddresses(searchStr);
    } catch (error) {
        return next(error);
    }
    return res.send(addresses);
})

router.get("/frequents", async (req, res, next) => {
    let frequents = []
    try {
        frequents = await getFrequents(req.user.uid);
    } catch (err) {
        return next(err);
    }
    return res.send(frequents);
})

router.get("/account", async (req, res, next) => {
    let accountInfo = [];
    try {
        accountInfo = await getAccountInfo(req.user.uid);
    } catch (err) {
        return next(err);
    }
    return res.send(accountInfo);
})

router.post("/addCreditCard", async (req, res, next) => {
    try {
        await addCreditCard(req.user.uid, req.body.creditCard)
    } catch (error) {
        return next(error)
    }
    return res.status(200).send('Card added');
})

router.post("/removeCreditCard", async (req, res, next) => {
    try {
        await removeCreditCard(req.user.uid)
    } catch (error) {
        return next(error)
    }
    return res.status(200).send('Card removed');
})

// Get eligible promos
router.get("/promos/:rid", [check('rid').isInt()], validate,
    async (req, res, next) => {
        let promos = []
        try {
            promos = await getEligiblePromos(req.user.uid, req.params.rid);
        } catch (error) {
            return next(error);
        }
        return res.json(promos);
    });

router.post("/checkout", async (req, res, next) => {
    try {
        addOrder(req.user.uid, req.body);
    } catch (error) {
        return next(error)
    }
    return res.status(200).send('Order Submitted');
})
module.exports = router;