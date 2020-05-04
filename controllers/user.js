const db = require('../db');
const { Roles } = require('../auth/index');
const PS = require('pg-promise').PreparedStatement;

const psGetUsers = new PS({ name: 'get-users', text: 'SELECT * FROM Users' });
const psGetUid = new PS({ name: 'getUserId', text: 'SELECT count(*) FROM Users' });
const psGetUserByUid = new PS({ name: 'get-user-by-uid', text: 'SELECT * from USERS WHERE uid = $1' });
const psGetUserByUsername = new PS({ name: 'get-user-by-username', text: 'SELECT * from USERS WHERE username = $1' });
const psGetRole = new PS({
    name: 'get-role', text:
        `SELECT distinct case
            when exists (select 1 from Customers where uid = $1) then '${Roles.customer}'
            when exists (select 1 from Riders where uid = $1) then '${Roles.rider}'
            when exists (select 1 from Managers where uid = $1) then '${Roles.manager}'
            when exists (select 1 from Staff where uid = $1) then '${Roles.staff}'
            else null
        end as role FROM Users`
});
const psAddUser = new PS({
    name: 'add-user',
    text: `INSERT INTO Users(name, userName, salt, passwordHash)
           VALUES ($1, $2, 'salt', $3) RETURNING uid`
});
const psAddCustomer = new PS({
    name: 'add-customer',
    text: `INSERT INTO Customers(uid, points) VALUES ($1, $2)`
})


const getUsers = async function () {
    return await db.any(psGetUsers);
};

const getRole = async function (uid) {
    return await db.one(psGetRole, [uid])
}

const getUserByUid = async function (uid) {
    user = await db.one(psGetUserByUid, [uid])
    let temp = await db.one(psGetRole, [uid])
    user.role = temp.role
    return user
}

const getUserByUsername = async function (username) {
    user = await db.one(psGetUserByUsername, [username]);
    user['role'] = (await db.one(psGetRole, [user.uid])).role
    return user
}

const getNextUid = async () => {
    const UID = await db.any(psGetUid);
    uid = parseInt(UID[0].count) + 1;
    return uid;
}

const addCustomer = async (customer) => {
    try {
        await db.tx(async t => {
            const qAddUser = await t.one(psAddUser,
                [customer.name, customer.username, customer.password])
            const addCustomer = t.none(psAddCustomer, [qAddUser.uid, 0]);
            t.batch([addCustomer]);
        });
    } catch (err) {
        throw "User exists";
    }
}

module.exports = {
    getUsers, getRole: getRole, getUserByUid, getUserByUsername, getNextUid, addCustomer
}