const db = require('../db');
const PS = require('pg-promise').PreparedStatement;
const { getEligiblePromos } = require('./customer');

const psMinSpending = new PS({ name: 'get-min-spending', text: 'SELECT minSpending FROM Restaurants WHERE rid = $1' });
const psGetPrice = new PS({ name: 'get-price', text: `SELECT price FROM Food WHERE rid = $1 AND fname = $2` })
const psGetFoodStatus = new PS({ name: 'get-food-status', text: `SELECT (dailyLimit - numOrders) as qty FROM Food WHERE rid = $1 AND fname = $2` })
const psGetAddrId = new PS({ name: 'get-addr-id', text: `SELECT addrId FROM Address WHERE streetName = $1 AND unit = $2 AND postalCode = $3` })
const psCheckFrequents = new PS({ name: 'check-freq', text: `SELECT true as found FROM Frequents WHERE uid = $1 and addrId = $2` })
const psGetPromo = new PS({ name: 'get-promo', text: `SELECT percentOff, points FROM Promotions WHERE pid = $1` })

const psAddFrequents = new PS({ name: 'add-freq', text: `INSERT INTO Frequents(uid, addrId, lastUsed) VALUES ($1, $2, CURRENT_TIMESTAMP)` })
const psUpdateFrequents = new PS({ name: 'update-freq', text: `UPDATE Frequents set lastUsed = CURRENT_TIMESTAMP WHERE uid = $1 AND addrId = $2` })
const psAddAddress = new PS({
    name: 'add-address',
    text: `INSERT INTO Address(streetName, unit, postalCode)
            SELECT $1, $2, $3
            EXCEPT
            SELECT streetname, unit, postalCode FROM Address
            RETURNING addrId`})
const psAddOrder = new PS({
    name: 'add-order',
    text: `Insert INTO Orders(customerId, orderTime, deliveryFee, isDeliveryFeeWaived, finalPrice, addrId, pid) VALUES
            ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6) RETURNING oid` })
const psAddPoints = new PS({
    name: 'add-points',
    text: `UPDATE Customers set points = (points + $2) WHERE uid = $1`
})
const psAddCollates = new PS({
    name: 'add-collates',
    text: `INSERT INTO Collates(fname, rid, oid, totalPrice, qty)
            SELECT $1 fname, $2 rid, $3 oid, T.totalPrice, $4 qty
            FROM (SELECT (price * $4) totalPrice
                  FROM Food WHERE rid = $2 AND fname = $1) T`
})
const psMinusWaivePoints = new PS({
    name: 'minus-waive-points',
    text: `UPDATE Customers set points = (points - $2) WHERE uid = $1 AND points >= $2`
})
const psUpdateFoodCount = new PS({
    name: 'update-food-count',
    text: `UPDATE Food set numOrders = (numOrders + $3) WHERE fname = $1 and rid = $2`
})

const addOrder = async function (user, order) {
    let total = await totalPrice(order.rid, order.items);
    let addrId = null;
    let awardedPoints = 0;
    if (!(await validateOrder(user, order, total))) {
        throw "Invalid Order";
    }
    const q1 = await db.oneOrNone(psAddAddress,
        [order.addrInfo.address, order.addrInfo.unit, order.addrInfo.postal]);
    if (q1 != null) {
        addrId = q1.addrid;
    } else {
        const q = await db.oneOrNone(psGetAddrId,
            [order.addrInfo.address, order.addrInfo.unit, order.addrInfo.postal]);
        addrId = q.addrid;
    }
    if (order.pid != null) {
        const { discountedPrice, points } = await getDiscountedPriceAndPoints(total, order.pid)
        awardedPoints = points;
        total = discountedPrice;
    }
    await processOrder(user, order, addrId, total, awardedPoints);
}

async function processOrder(uid, order, addrId, total, awardedPoints) {
    const isFreq = await isFrequents(uid, addrId);
    try {
        await db.tx(async t => {
            const queries = [];
            if (isFreq) {
                queries.push(t.none(psUpdateFrequents, [uid, addrId]));
            } else {
                queries.push(t.none(psAddFrequents, [uid, addrId]));
            }
            //Add order
            const qAddOrder = await t.one(psAddOrder, [uid, 3, order.waiveFee, total, addrId, order.pid])
            let oid = qAddOrder.oid;

            // Add Collates and update Food count
            order.items.forEach(item => {
                queries.push(t.none(psAddCollates, [item.fname, order.rid, oid, item.qty]));
                queries.push(t.none(psUpdateFoodCount, [item.fname, order.rid, item.qty]))
            })

            // Minus points for waive
            if (order.waiveFee) {
                queries.push(t.none(psMinusWaivePoints, [uid, 300]));
            }
            return t.batch(queries);
        });
    } catch (error) {
        throw 'Error adding order'
    }
    // Award points
    await db.none(psAddPoints, [uid, awardedPoints]);
}

async function validateOrder(uid, order, total) {
    if (total < (await getMinSpending(order.rid))) {
        return false;
    }
    if (order.pid != null && !(await isEligible(uid, order.rid, order.pid))) {
        return false;
    }
    if (!(await isFoodAvailable(order.rid, order.items))) {
        return false;
    }
    return true;
}

async function totalPrice(rid, items) {
    let total = 0;
    for (const item of items) {
        const data = await db.oneOrNone(psGetPrice, [rid, item.fname])
        if (data == null) {
            throw "Invalid Order";
        }
        total += data.price * item.qty;
    }
    return total;
}

async function getMinSpending(rid) {
    const data = await db.oneOrNone(psMinSpending, [rid])
    return data.minspending;
}

async function isEligible(uid, rid, pid) {
    const data = await getEligiblePromos(uid, rid);
    let pids = data.map(promo => promo.pid);
    return pids.includes(pid);
}

async function isFoodAvailable(rid, items) {
    for (const item of items) {
        const data = await db.any(psGetFoodStatus, [rid, item.fname])
        if (data == null || item.qty > data.qty) {
            return false;
        }
    }
    return true;
}
async function isFrequents(uid, addrId) {
    const data = await db.oneOrNone(psCheckFrequents, [uid, addrId]);
    if (data == null) {
        return false;
    }
    return true;
}

async function getDiscountedPriceAndPoints(price, pid) {
    const data = await db.one(psGetPromo, [pid])
    return {
        discountedPrice: ((100 - data.percentoff) * price / 100),
        points: data.points
    };
}

module.exports = {
    addOrder
}