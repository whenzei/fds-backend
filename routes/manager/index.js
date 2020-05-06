var router = require('express').Router();
const {getCustomerSignups} = require('../../controllers/customer');
const {getStaffRiderList, deleteUser, getGlobalPromos, addPromo, deleteGlobalPromo, editPromo, addRestaurants} = require('../../controllers/manager');
const {getRestaurantWithAddress, deleteRestaurant, updateRestaurant} = require('../../controllers/restaurant');


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

router.get("/all-staff-rider", async (req, res, next) => {
    let result;
    try {
        result = await getStaffRiderList();
    } catch (err) {
        return next(err);
    } 
    return res.send(result);
})

router.post("/delete-user", async (req, res, next) => {
    let result;
try {
    result = await deleteUser(req.body.role, req.body.uid);
} catch (err) {
    return next(err);
}
return res.send(req.body.name.toString() + " deleted successfully.");
})

router.get("/get-restaurants", async (req, res, next) => {
    let result;
try {
    result = await getRestaurantWithAddress();
} catch (err) {
    return next(err);
}
return res.send(result);
})

router.post("/delete-restaurant/:rid", async (req, res, next) => {
    let result;
try {
    result = await deleteRestaurant(req.params.rid);
} catch (err) {
    return next(err);
}
return res.send(result);
})

router.post('/add-restaurant', async (req, res, next) => {
    try {
        const result = await addRestaurants(req.body.restaurant);
} catch (err) {
    return next(err)
}
return res.send(req.body.restaurant.rname.toString() + " added successfully.");
})

router.post('/update-restaurant', async (req, res, next) => {
    try {
        const result = await updateRestaurant(req.body.restaurant);
} catch (err) {
    return next(err)
}
return res.send(req.body.restaurant.rname.toString() + " added successfully.");
})

router.get("/global-promos", async (req, res, next) => {
    let result;
try {
    result = await getGlobalPromos();
} catch (err) {
    return next(err);
}
return res.send(result);
})

router.post('/add-global-promo', async (req, res, next) => {
    try {
        const result = await addPromo(req.body.promo);
} catch (err) {
    return next(err)
}
return res.send("Promotion added successfully.");
})

router.post("/delete-global-promo/:pid", async (req, res, next) => {
    let result;
try {
    result = await deleteGlobalPromo(req.params.pid);
} catch (err) {
    return next(err);
}
return res.send(result);
})

router.post('/update-global-promo', async (req, res, next) => {
    try {
        const result = await editPromo(req.body.promo);
} catch (err) {
    return next(err)
}
return res.send("Promotion updated successfully.");
})


router.use('/orders', require('./orders'));
router.use('/rider', require('./rider'));
module.exports = router;
