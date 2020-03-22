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

const psGetMostPopularFoodCount = new PS({ name: 'get-most-popular-food-count', text:
`
WITH FoodFreq AS (
    SELECT fname, sum(qty) as totalQty, DATE_PART('month', orderTime) as mth, DATE_PART('year', orderTime) as yr
    FROM Collates natural join Orders
    WHERE rid = $1 
    GROUP BY fname, mth, yr
)
SELECT fname, totalQty
FROM FoodFreq
WHERE mth = $2 AND yr = $3
ORDER BY totalQty DESC
LIMIT $4;
`});

const psGetLeastPopularFoodCount = new PS({ name: 'get-least-popular-food-count', text:
`
WITH FoodFreq AS (
    SELECT fname, sum(qty) as totalQty, DATE_PART('month', orderTime) as mth, DATE_PART('year', orderTime) as yr
    FROM Collates natural join Orders
    WHERE rid = $1 
    GROUP BY fname, mth, yr
)
SELECT fname, totalQty
FROM FoodFreq
WHERE mth = $2 AND yr = $3
ORDER BY totalQty ASC
LIMIT $4;
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

const getFoodCount= async (rid, month, year, isDesc, limit) => {
    console.log(typeof(isDesc))
    if (isDesc === 'true') {
        console.log('most')
        return await db.any(psGetMostPopularFoodCount, [2, month, year, limit]);
    }
    console.log('least')
    return await db.any(psGetLeastPopularFoodCount, [2, month, year, limit]);
};

const getMinMaxDate = async () => {
    return await db.oneOrNone(psGetMinMaxDate);
}

module.exports = {
    getStaff, getRestaurantId, getTotalOrdersAndCost, getFoodCount, getMinMaxDate
}
