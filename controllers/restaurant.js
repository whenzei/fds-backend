const db = require('../db');
const getAllRestaurants = async () => {
    const restaurants = await db.any('SELECT * FROM Restaurants')
    return restaurants
};

const getMenu = async (rid) => {
    const menu = await db.any(`SELECT * FROM Food WHERE rid = ${rid}`)
    return menu
};

module.exports = {
    getAllRestaurants, getMenu
}