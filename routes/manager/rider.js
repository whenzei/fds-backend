var express = require('express');
var router = express.Router();
const {getRiderSalaryInfo, getRiderTotalOrdersAndAverageTime, getRiderRatingInfo} = require('../../controllers/rider');


router.get('/salary-summary', async (req, res, next) => {
    let result;
try {
    result = await getRiderSalaryInfo();
} catch (err) {
    return next(err)
}
return res.send(result);
});

router.get('/rating-summary', async (req, res, next) => {
    let result;
try {
    result = await getRiderRatingInfo();
} catch (err) {
    return next(err)
}
return res.send(result);
});

router.get('/order-summary', async (req, res, next) => {
    let result;
try {
    result = await getRiderTotalOrdersAndAverageTime();
} catch (err) {
    return next(err)
}
return res.send(result);
});

module.exports = router;