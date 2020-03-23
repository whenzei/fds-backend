const db = require('../db');
const PS = require('pg-promise').PreparedStatement;

const psGetMonthlyOrderSummary = new PS({ name: 'monthly-order-summary',
    text: 'SELECT date_part(\'month\', ordertime) as month, date_part(\'year\', ordertime) as year, count(*) as order_count' +
    ' FROM orders ' +
    'GROUP BY month, year ' +
    'ORDER BY year, month;'});

const psGetYearlyOrderSummary = new PS({ name: 'yearly-order-summary',
    text: 'SELECT date_part(\'year\', ordertime) as year, count(*) as order_count' +
    ' FROM orders ' +
    'GROUP BY year ' +
    'ORDER BY year;'});

const psGetYearlySalesSummary = new PS({ name: 'yearly-sales-summary',
    text: 'SELECT date_part(\'year\', ordertime) as year, sum(finalprice) as yearly_sales' +
    ' FROM orders ' +
    'GROUP BY year ' +
    'ORDER BY year;'});

const psGetMonthlySalesSummary = new PS({ name: 'monthly-sales-summary',
    text: 'SELECT date_part(\'month\', ordertime) as month, date_part(\'year\', ordertime) as year, sum(finalprice) as monthly_sales' +
    ' FROM orders ' +
    'GROUP BY month, year ' +
    'ORDER BY year, month;'});

const psGetMonthlyCustomerOrderSummary = new PS({name: 'customer-monthly-order-summary', text: 'SELECT customerid, date_part(\'month\', ordertime) as month, date_part(\'year\', ordertime) as year, \n' +
    'count(*) as order_count, sum(finalprice) as totalPrice\n' +
    'FROM ORDERS \n' +
    'GROUP BY month, year, customerid\n' +
    'ORDER BY year, month;'});

const psGetYearlyCustomerOrderSummary = new PS({name: 'customer-yearly-order-summary', text: 'SELECT customerid, date_part(\'year\', ordertime) as year,count(*) as order_count, sum(finalprice) as totalPrice \n' +
    'FROM ORDERS \n' +
    'GROUP BY year, customerid \n' +
    'ORDER BY year;'});

const getOrderSummary = async (queryParams) => {
    interval = queryParams.interval;
    if(interval == 'yearly')
        return await db.any(psGetYearlyOrderSummary);
    else if(interval == 'monthly' || interval == null)
        return await db.any(psGetMonthlyOrderSummary);
    else
        return "Interval value can only be yearly or monthly";
}

const getSalesSummary = async (queryParams) => {
    interval = queryParams.interval;
    if(interval == 'yearly')
        return await db.any(psGetYearlySalesSummary);
    else if(interval == 'monthly' || interval == null)
        return await db.any(psGetMonthlySalesSummary);
    else
        return "Interval value can only be yearly or monthly";
}

const getCustomerOrderSummary = async (queryParams) => {
    console.log(queryParams)
    month = queryParams.month;
    year = queryParams.year;
    if(month == 'true' || (month == 'true' && year == 'true') ||
        (month == null && year == null))
        return await db.any(psGetMonthlyCustomerOrderSummary);
    else if (year == 'true')
        return await db.any(psGetYearlyCustomerOrderSummary);
    else
        return "Please enter only true or false for month and year fields";
}


module.exports = {
    getOrderSummary, getSalesSummary, getCustomerOrderSummary
}