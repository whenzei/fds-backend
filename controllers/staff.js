const db = require('../db');
const {Roles} = require('../auth')
const PS = require('pg-promise').PreparedStatement;

const psGetStaff = new PS({ name: 'get-staff', text: 'SELECT * FROM Staff WHERE uid = $1;' });

const psGetRestaurantId = new PS({ name: 'get-restaurant-id', text: 'SELECT rid FROM Staff WHERE uid = $1;' });

const psGetTotalOrdersAndCost = new PS({ name: 'get-total-orders-and-cost', text:
`
WITH RestaurantOrderPair AS (
    SELECT DISTINCT rid, oid
    FROM Collates natural join Orders
)
SELECT count(distinct oid) as numOrders, sum(finalPrice) as totalCost, DATE_PART('month', orderTime) as mth, DATE_PART('year', orderTime) as yr
FROM RestaurantOrderPair natural join Orders
WHERE rid = $1 AND deliveredTime IS NOT NULL
GROUP BY mth, yr;
` });

const psGetTop5Food = new PS({ name: 'get-top-5-food', text:
`
WITH FoodFreq AS (
    SELECT fname, sum(qty) as totalQty, DATE_PART('month', orderTime) as mth, DATE_PART('year', orderTime) as yr
    FROM Collates natural join Orders
    WHERE rid = $1 
    GROUP BY fname, mth, yr
)
SELECT fname, totalQty
FROM FoodFreq
WHERE mth = $2 AND yr = $3;
 `});

const psGetMinMaxDate = new PS({ name: 'get-min-max-date', text: 'SELECT min(deliveredTime) as minDate, max(deliveredTime) as maxDate FROM Orders;' });

const getStaff = async () => {
    return await db.any(psGetStaff, [uid]);
};

const getRestaurantId = async (uid) => {
    return await db.one(psGetRestaurantId, [uid]);
};

const getTotalOrdersAndCost = async (rid) => {
    return await db.any(psGetTotalOrdersAndCost, [rid]);
};

const getTop5Food = async (rid, month, year) => {
    return await db.any(psGetTop5Food, [rid, month, year]);
};

const getMinMaxDate = async () => {
    return await db.one(psGetMinMaxDate);
}

module.exports = {
    getStaff, getRestaurantId, getTotalOrdersAndCost, getTop5Food, getMinMaxDate
}
