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

const psGetPromoStats = new PS({ name: 'get-promo-stats', text: `
WITH PromoDuration AS (
SELECT pid, startDate, endDate, (endDate - startDate + 1) as duration
FROM RestaurantPromos natural join Promotions
WHERE rid = $1)

SELECT pid, duration, count(*) as numOrders
FROM PromoDuration natural join Orders
WHERE orderTime >= startDate AND orderTime <= endDate
GROUP BY pid, duration; 
`});

const psGetAllOrders = new PS({ name: 'get-all-orders', text: 
`
WITH OrderRestaurantPair AS (
    SELECT DISTINCT rid, oid
    FROM Collates natural join Orders
),
RidToName AS (
    SELECT uid as riderId, name as rname
    FROM Riders natural join Users
),
CidToName AS (
    SELECT uid as customerId, name as cname
    FROM Customers natural join Users
)
SELECT oid, rname, cname, orderTime, deliveredTime, finalPrice, (SELECT string_agg(fname, ', ') FROM COLLATES C WHERE C.oid = X.oid) as itemsOrdered
FROM (Orders natural join OrderRestaurantPair join RidToName using (riderId) join CidToName using (customerId)) as X
WHERE rid = $1
ORDER BY orderTime DESC, deliveredTime DESC;`});

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
    if (isDesc === 'true') {
        return await db.any(psGetMostPopularFoodCount, [rid, month, year, limit]);
    }
    return await db.any(psGetLeastPopularFoodCount, [rid, month, year, limit]);
};

const getMinMaxDate = async () => {
    return await db.oneOrNone(psGetMinMaxDate);
};

const getPromoStats = async (rid) => {
    return await db.any(psGetPromoStats, [rid]);
};

const getAllOrders = async (rid) => {
    return await db.any(psGetAllOrders, [rid]);
}

module.exports = {
    getStaff, getRestaurantId, getTotalOrdersAndCost, getFoodCount, getMinMaxDate, getPromoStats, getAllOrders
}
