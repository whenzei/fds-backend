const db = require('../db');
const {Roles} = require('../auth')

const getOrdersByUid = async (uid) => {
   const orders =  await db.any(`SELECT * FROM Orders WHERE customerid = ${uid}`)
   console.log(orders)
   return orders;
}

const getFoodCollation = async (oid) => {
    const collation =  await db.any(`SELECT * FROM Collates WHERE oid = ${oid}`)
    return collation;
 }


module.exports = {
    getOrdersByUid: getOrdersByUid, getFoodCollation
}