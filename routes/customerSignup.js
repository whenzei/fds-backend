const express = require('express')
const router = express.Router()
const {addCustomer} = require("../controllers/user")


router.post("/", async (req, res, next) => {
    try {
        await addCustomer(req.body);
    } catch (err) {
        return next(err)
    }
    return res.send('Customer added successfully.');
})
module.exports = router