const express = require('express')
const router = express.Router()
const { getMenu, getRestaurants } = require('../controllers/restaurant')
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

router.get("/addresses/", async(req, res, next) => {
    const searchStr = req.query.search;
    let addresses = getAddresses(searchStr);
    return res.send(addresses);
}) 

module.exports = router;