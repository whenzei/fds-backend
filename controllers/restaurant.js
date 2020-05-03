const db = require('../db');
const PS = require('pg-promise').PreparedStatement;

const psGetRestaurants = new PS({ name: 'get-retaurants', text: 'SELECT * FROM Restaurants' })
const psGetMenu = new PS({ name: 'get-menu', text: 'SELECT * FROM Food WHERE rid = $1 ORDER BY fname' });
const psGetRestaurant = new PS({ name: 'get-restaurant', text: 'SELECT * FROM Restaurants WHERE rid = $1' });
const psGetCuisines = new PS({ name: 'get-cuisines', text: 'SELECT unnest(enum_range(NULL::CUISINE_ENUM))' });
const psGetRestaurantRating = new PS({
    name: 'get-res-rating',
    text: `SELECT ROUND(ROUND(AVG(stars)*2, 0) / 2, 1) as stars
           FROM Orders O JOIN Reviews R using (oid)
           WHERE EXISTS (
               SELECT 1
               FROM Collates
               WHERE oid = O.oid
               AND rid = $1
            )`
})
const psGetRestaurantReviews = new PS({
    name: 'get-res-reviews',
    text: `SELECT R.stars, R.comment, to_char(R.date, 'DD-Mon-YYYY') as date
           FROM Orders O JOIN Reviews R using (oid)
           WHERE EXISTS (
            SELECT 1
            FROM Collates
            WHERE oid = O.oid
            AND rid = $1
           )
           ORDER BY R.date desc`
})
const psGetFilteredRestaurants = new PS({
    name: 'get-fitlered-restaurants',
    text: `SELECT DISTINCT rid, minSpending, rname, addrId
           FROM Food NATURAL JOIN Restaurants
           WHERE fname ILIKE $1
           OR rname ILIKE $1`
});


const psInsertFoodItem = new PS({ name: 'insert-food-item', text: 'INSERT INTO Food (fname, rid, price, category, dailyLimit) VALUES ($2, (SELECT rid FROM Staff WHERE uid = $1), ($3::FLOAT * 100), $4, $5);' });
const psUpdateFoodItem = new PS({ name: 'update-food-item', text: 'UPDATE Food SET fname = $3, price = ($4::FLOAT * 100), category = $5, dailyLimit = $6, numOrders = $7 WHERE rid = (SELECT rid FROM Staff WHERE uid = $1) AND fname = $2;' });
const psDeleteFoodItem = new PS({ name: 'delete-food-item', text: 'DELETE FROM Food WHERE rid = (SELECT rid FROM Staff WHERE uid = $1) AND fname = $2' });
const psGetMinSpending = new PS({ name: 'get-min-spend', text: 'SELECT ROUND(minSpending::NUMERIC / 100, 2) as minspending FROM Restaurants WHERE  rid = $1' })
const psUpdateMinSpending = new PS({ name: 'update-min-spending', text: 'UPDATE Restaurants SET minSpending = ($2::FLOAT * 100) WHERE rid = (SELECT rid FROM Staff WHERE uid = $1)' });

const getRestaurants = async () => {
    return await db.any(psGetRestaurants)
};

const getMenu = async (rid) => {
    return await db.any(psGetMenu, [rid])
};

const getRestaurant = async (rid) => {
    return await db.oneOrNone(psGetRestaurant, [rid])
}

const getMinSpending = async (rid) => {
    return await db.one(psGetMinSpending, [rid]);
};

const getCuisines = async () => {
    return await db.any(psGetCuisines);
}

const getRestaurantRating = async (rid) => {
    return await db.oneOrNone(psGetRestaurantRating, [rid])
}

const getRestaurantReviews = async (rid) => {
    return await db.any(psGetRestaurantReviews, [rid])
}

const getFilteredRestaurants = async (value) => {
    return await db.any(psGetFilteredRestaurants, [value])
}

const insertFoodItem = async (uid, item) => {
    await db.none(psInsertFoodItem, [uid, item.fname, item.price, item.category, item.dailylimit]);
}

const updateFoodItem = async (uid, fname, item) => {
    await db.none(psUpdateFoodItem, [uid, fname, item.fname, item.price, item.category, item.dailylimit, item.numorders]);
}

const deleteFoodItem = async (uid, fname) => {
    await db.none(psDeleteFoodItem, [uid, fname]);
}

const updateMinSpending = async (uid, minSpending) => {
    await db.none(psUpdateMinSpending, [uid, minSpending]);
}

module.exports = {
    getRestaurants, getMenu, getRestaurant, getRestaurantRating, getRestaurantReviews,
    getCuisines, insertFoodItem, updateFoodItem, deleteFoodItem, updateMinSpending, getMinSpending, getFilteredRestaurants
}
