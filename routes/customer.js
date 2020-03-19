const express = require('express')
const router = express.Router()
const { getRestaurants } = require('../controllers/customer')

router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

router.get("/restaurants", (req, res) => {
    getRestaurants().then((restaurants) => {
        res.send(restaurants);
    }).catch((error) => {
        res.send(error);
    });
})
module.exports = router;