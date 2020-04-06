const db = require('../db');
const PS = require('pg-promise').PreparedStatement;

const psGetRestaurants = new PS({ name: 'get-retaurants', text: 'SELECT * FROM Restaurants' })
const psGetMenu = new PS({ name: 'get-menu', text: 'SELECT * FROM Food WHERE rid = $1' });
const psGetRestaurant = new PS({ name: 'get-restaurant', text: 'SELECT * FROM Restaurants WHERE rid = $1' });
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
const getRestaurants = async () => {
    return await db.any(psGetRestaurants)
};

const getMenu = async (rid) => {
    return await db.any(psGetMenu, [rid])
};

const getRestaurant = async (rid) => {
    return await db.oneOrNone(psGetRestaurant, [rid])
}

const getRestaurantRating = async (rid) => {
    return await db.oneOrNone(psGetRestaurantRating, [rid])
}

const getRestaurantReviews = async (rid) => {
    return await db.any(psGetRestaurantReviews, [rid])
}

module.exports = {
    getRestaurants, getMenu, getRestaurant, getRestaurantRating, getRestaurantReviews
}