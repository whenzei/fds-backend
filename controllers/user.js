const db = require('../db');

const getUsers = function (req, res) {
    db.any('SELECT * FROM Users')
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function (error) {
            res.send(error)
        });
};

async function getUserType(userName) {
    let result;
    try {
        result = await db.one(
            `SELECT distinct case
            when exists (select 1 from Customers where username = '${userName}') then 'Customer'
            when exists (select 1 from Riders where username = '${userName}') then 'Rider'
            when exists (select 1 from Managers where username = '${userName}') then 'Manager'
            when exists (select 1 from Staff where username = '${userName}') then 'Staff'
            end as userType FROM Customers;`
        );
    } catch (err) {
        console.log(err)
    }
    return result.usertype;
}

module.exports = {
    getUsers, getUserType
}