var router = require('express').Router();
const {getCustomerSignups} = require('../../controllers/customer');


router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

router.get("/customer-signup-summary", async (req, res, next) => {
    let result;
try {
    result = await getCustomerSignups(req.query);
} catch (err) {
    return next(err)
}
return res.send(result);
});

router.use('/orders', require('./orders'));
module.exports = router;
