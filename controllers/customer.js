const db = require('../db');
const PS = require('pg-promise').PreparedStatement;

const psGetCustomers = new PS({ name: 'get-customers', text: 'SELECT * FROM Customers' });

const getCustomers = async function () {
    return await db.any(psGetCustomers);
};

module.exports = {
    getCustomers
}