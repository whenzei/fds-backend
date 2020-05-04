var express = require('express');
var router = express.Router();
const {getOrderSummary, getSalesSummary, getCustomerOrderSummary, getAreaOrderSummary} = require('../../controllers/orders');

router.get('/orders-summary', async (req, res, next) => {
    let result;
try {
    result = await getOrderSummary(req.query);
} catch (err) {
    return next(err)
}
return res.send(result);
});

router.get('/sales-summary/',
    async (req, res, next) => {
    let result;
try {
    result = await getSalesSummary(req.query);
} catch (err) {
    return next(err)
}
return res.send(result);
});

router.get('/customer-order-summary/',
    async (req, res, next) => {
    let result;
    try {
        result = await getCustomerOrderSummary(req.query);
    } catch (err) {
        return next(err);
    }
    return res.send(result);
})

router.get('/area-order-summary/',
    async (req, res, next) => {
    let result;
    try {
        result = await getAreaOrderSummary();
    } catch (err) {
        return next(err)
    }
    return res.send(result);
})

module.exports = router;