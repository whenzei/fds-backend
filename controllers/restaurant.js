const db = require('../db');
const PS = require('pg-promise').PreparedStatement;

const psGetRestaurants = new PS({ name: 'get-retaurants', text: 'SELECT * FROM Restaurants' })
const psGetMenu = new PS({ name: 'get-menu', text: 'SELECT * FROM Food WHERE rid = $1' });
const psGetRestaurant = new PS({ name: 'get-restaurant', text: 'SELECT * FROM Restaurants WHERE rid = $1' });

const getRestaurants = async () => {
    return await db.any(psGetRestaurants)
};

const getMenu = async (rid) => {
    return await db.any(psGetMenu, [rid])
};

const getRestaurant = async (rid) => {
    return await db.oneOrNone(psGetRestaurant, [rid])
}

module.exports = {
    getRestaurants, getMenu, getRestaurant
}