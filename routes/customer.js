const express = require('express')
const router = express.Router()
const { getRestaurant, getMenu, getAllRestaurants } = require('../controllers/restaurant')

router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

router.get("/restaurants", async (req, res, next) => {
    let restaurants = []
    try {
        restaurants = await getAllRestaurants();
    } catch (err) {
        return next(err)
    }
    return res.send(restaurants);
})


router.get("/restaurants/:rid", async (req, res, next) => {
    let menu = []
    try {
        menu = await getMenu(req.params.rid);
    } catch (err) {
        return next(err)
    }
    return res.send(menu)
})
module.exports = router;