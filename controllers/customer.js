const db = require('../db');
const PS = require('pg-promise').PreparedStatement;
const moment = require('moment');

const psGetCustomers = new PS({ name: 'get-customers', text: 'SELECT * FROM Customers' });
const psGetAccountInfo = new PS({
    name: 'get-account-info',
    text: `SELECT name, points, creditCard FROM Customers C JOIN Users U on C.uid = U.uid
            WHERE C.uid = $1`
});
const psGetFrequents = new PS({
    name: 'get-frequents',
    text: ` SELECT A.streetName as address, A.unit, A.postalCode as postal
             FROM Frequents F JOIN Address A ON F.addrId = A.addrId
             WHERE F.uid = $1`
});
const psGetCreditCard = new PS({
    name: 'get-credit-card',
    text: `SELECT creditCard FROM Customers where uid = $1`
});
const psAddCreditCard = new PS({
    name: 'add-credit-card',
    text: `UPDATE Customers set creditCard = $1 WHERE uid = $2`
});
const psRemoveCreditCard = new PS({
    name: 'remove-credit-card',
    text: `UPDATE Customers set creditCard = null WHERE uid = $1`
});
const psGetElgiblePromos = new PS({
    name: 'get-eligible-promos',
    text: ` WITH FilteredPromos AS (
                SELECT pid, startDate, endDate, percentOff, minSpending, monthsWithNoOrders
                FROM GlobalPromos NATURAL JOIN Promotions
                UNION
                SELECT pid, startDate, endDate, percentOff, minSpending, monthsWithNoOrders
                FROM RestaurantPromos R NATURAL JOIN Promotions WHERE R.rid = $3
            ), EligibilePromos AS (
                SELECT * FROM FilteredPromos WHERE startDate <= $1::DATE AND endDate >= $1::DATE
                AND NOT EXISTS (
                    SELECT 1
                    FROM Orders
                    WHERE customerId = $2
                    AND EXTRACT(MONTH FROM age(NOW(), orderTime)) <= coalesce(monthsWithNoOrders, 0) 
                )
                EXCEPT
                SELECT pid, startDate, endDate, percentOff, minSpending, monthsWithNoOrders
                FROM Orders NATURAL JOIN Promotions
                WHERE customerId = $2
            ) 
            SELECT pid, coalesce(percentOff, 0) as percentOff, coalesce(minSpending, 0) as minSpending
            FROM EligibilePromos;
            `
})

const psGetCustomerMonthlySignUpSummary = new PS ({name:"monthly-customer-signups", text:"SELECT date_part('month', creationtime) as month, " +
        "date_part('year', creationtime) as year, count(*) as signups " +
    "FROM customers natural join users " +
    "GROUP BY year, month;"});

const psGetCustomerYearlySignUpSummary = new PS ({name:"yearly-customer-signups", text:"SELECT date_part('year', creationtime) as year, count(*) as signups " +
    "FROM customers natural join users " +
    "GROUP BY year;"});

const getCustomers = async function () {
    return await db.any(psGetCustomers);
};

const getFrequents = async function (uid) {
    return await db.any(psGetFrequents, [uid]);
}

const getAccountInfo = async function (uid) {
    return await db.any(psGetAccountInfo, [uid])
}

const addCreditCard = async function (uid, card) {
    const dbData = await db.oneOrNone(psGetCreditCard, [uid])
    if (dbData['creditcard'] === null) {
        await db.none(psAddCreditCard, [card, uid])
    } else {
        throw 500;
    }
}

const removeCreditCard = async function (uid) {
    await db.none(psRemoveCreditCard, [uid]);
}

const getEligiblePromos = async function (uid, rid) {
    const today = moment().format('YYYY-MM-DD');
    return await db.any(psGetElgiblePromos, [today, uid, rid]);
}

const getCustomerSignups = async (queryParams) => {
    month = queryParams.month;
    year = queryParams.year;
    
    if(year == 'true') {
        return await db.any(psGetCustomerYearlySignUpSummary)
    } else {
        return await db.any(psGetCustomerMonthlySignUpSummary)
    }
}
module.exports = {
    getCustomers, getFrequents, getAccountInfo, addCreditCard, removeCreditCard, getEligiblePromos, getCustomerSignups,
}