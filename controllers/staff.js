const db = require('../db');
const { Roles } = require('../auth')
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

const psGetPromoStats = new PS({ name: 'get-promo-stats', text: 
`
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
SELECT oid, rname, cname, orderTime, deliveredTime, finalPrice, (SELECT array_agg(fname) FROM COLLATES C WHERE C.oid = X.oid) as itemsOrdered
FROM (Orders natural join OrderRestaurantPair join RidToName using (riderId) join CidToName using (customerId)) as X
WHERE rid = $1
ORDER BY orderTime DESC, deliveredTime DESC;`});

const psGetRestaurantPromos = new PS({ name: 'get-promos', text: `SELECT pid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders from Promotions natural join RestaurantPromos WHERE rid = $1 ORDER BY pid;` });

const psInsertPromo = new PS({ name: 'get-promo-by-id', text:
`
INSERT into Promotions (startDate, endDate, points, percentOff, minSpending, monthsWithNoOrders) values
($1, $2, $3, $4, $5, $6) RETURNING pid;
`});

const psInsertRestaurantPromo = new PS({ name: 'insert-rest-promo', text: `INSERT into RestaurantPromos (rid, pid) values ($1, $2);` });

const psEditRestaurantPromos = new PS({ name: 'edit-promo', text:
`
UPDATE Promotions
SET
startDate = $2, endDate = $3, points = $4, percentOff = $5, minSpending = $6, monthsWithNoOrders  = $7
WHERE pid = $1;
`});

const psDeleteRestaurantPromos = new PS({ name: 'delete-promo', text: 'DELETE FROM Promotions WHERE pid = $1;' });

const getStaff = async () => {
    return await db.any(psGetStaff, [uid]);
};

const getRestaurantId = async (uid) => {
    return await db.one(psGetRestaurantId, [uid]);
};

const getTotalOrdersAndCost = async (rid) => {
    return await db.any(psGetTotalOrdersAndCost, [rid]);
};

const getFoodCount = async (rid, month, year, isDesc, limit) => {
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

const getRestaurantPromos = async (rid) => {
    return await db.any(psGetRestaurantPromos, [rid]);
}

const insertRestaurantPromos = async (rid, item) => {
    const pid = await db.one(psInsertPromo, [item.startdate, item.enddate, item.points, item.percentoff, item.minspending, item.monthswithnoorders])
        .then((res) => {
            db.none(psInsertRestaurantPromo, [rid, res.pid]);
            return res.pid;
        })
        .catch(error => {
            throw 500;
        });
    return pid;
};

const updateRestaurantPromos = async (item) => {
    await db.none(psEditRestaurantPromos, [item.pid, item.startdate, item.enddate, item.points, item.percentoff, item.minspending, item.monthswithnoorders])
};

const deleteRestaurantPromos = async (pid) => {
    await db.none(psDeleteRestaurantPromos, [pid]);
};

module.exports = {
    getStaff, getRestaurantId, getTotalOrdersAndCost, getFoodCount, getMinMaxDate, getPromoStats, getAllOrders, getRestaurantPromos,
    updateRestaurantPromos, deleteRestaurantPromos, insertRestaurantPromos
}
