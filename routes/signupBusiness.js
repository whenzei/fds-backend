var express = require('express');
var router = express.Router();
const {addUser} = require('../controllers/manager')

router.post('/', async (req, res, next) => {
    try {
        const result = await addUser(req.body.user);
    } catch (err) {
        return next(err)
    }
    return res.send(req.body.user.name.toString() + " added successfully.");
});


module.exports = router;