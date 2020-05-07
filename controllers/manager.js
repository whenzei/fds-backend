const db = require('../db');
const PS = require('pg-promise').PreparedStatement;
const { Roles } = require('../auth/index');
const { getNextUid } = require('../controllers/user');

const psGetStaffRider = new PS({
    name: 'get-all-rider-staff', text:
        `SELECT uid, name, 'Rider' as role FROM Users NATURAL JOIN Riders
         UNION
         SELECT uid, name, 'Staff' as role FROM Users NATURAL JOIN Staff;`
});

const psDeleteUser = new PS({
    name: 'delete-user', text:
    `DELETE FROM Users
    WHERE uid = $1`
});

const psInsertUser = new PS({ name: 'insert-user', text:
        `
INSERT into Users (name, username, salt, passwordhash) values
($1, $2, $3, $4) RETURNING uid;
`});

const psInsertStaff = new PS({ name: 'insert-staff', text:
        `
INSERT into Staff (uid, rid) values
($1, $2);
`});

const psInsertRider = new PS({ name: 'insert-rider', text:
        `INSERT into Riders (uid) values ($1);`
});



const psInsertRestaurant = new PS({ name: 'insert-restaurant', text:
        `
INSERT into Restaurants (rname, minspending, addrid) values
($2, $1, $3);
`});

const psInsertPromo = new PS({ name: 'get-promo-by-id', text:
        `
INSERT into Promotions (startDate, endDate, points, percentOff, minSpending, monthsWithNoOrders) values
($1, $2, $3, $4, ($5::FLOAT * 100) , $6) RETURNING pid;
`});

const psInsertGlobalPromo = new PS({name: 'add-global-promo', text: `INSERT into GlobalPromos (pid) values ($1)`});

const psDeleteGlobalPromo = new PS({name: 'delete-global-promo', text: `DELETE from GlobalPromos WHERE pid = $1`});

const psGetGlobalPromo = new PS({ name: 'get-promo', text: 'SELECT * FROM Promotions NATURAL JOIN Globalpromos' })

const psEditGlobalPromo = new PS({ name: 'edit-promo', text:
        `
UPDATE Promotions
SET
startDate = $2, endDate = $3, points = $4, percentOff = $5, minSpending = ($6::FLOAT * 100), monthsWithNoOrders  = $7
WHERE pid = $1 AND pid in (SELECT pid FROM GlobalPromos);
`});

const addUser = async (user) => {
    try {
        if(user == null) {
            return;
        }
        uid = await getNextUid();
        
        if (user.role == Roles.staff) {
            userData = [user.name, user.username, 'salt', user.password];
            await db.tx(async t => {
                const q1 = await t.one(psInsertUser, userData);
                staffData = [q1.uid, user.rid]
                const q2 = await t.none(psInsertStaff, staffData)
                return t.batch([q1, q2])
            })
        } else if (user.role == Roles.rider){
            userData = [user.name, user.username, 'salt', user.password];
            await db.tx(async t => {
                const q1 = await t.one(psInsertUser, userData);
                const q2 = await t.none(psInsertRider, q1.uid);
                return t.batch([q1,q2]);
            })
        } else {
            throw "Not authorised to add the user";
        }
    } catch (err) {
        throw (err, "User could not be added");
    }
}

async function getStaffRiderList() {
    return await db.any(psGetStaffRider)
}

async function deleteUser(role, uid) {
    try {
        if (!(role == Roles.staff || role == Roles.rider)) {
            throw  "Must be a rider or staff"
        }
        return await db.any(psDeleteUser, [uid]);
    } catch(e) {
        throw e;
    }
}

const addRestaurants = async (restaurant) => {
    try {
        if(restaurant == null) {
            return;
        }
        restData = [parseInt(restaurant.minspending), restaurant.rname,parseInt(restaurant.addrid)];
        await db.any(psInsertRestaurant, restData);
        
    } catch (err) {
        throw (err, "Restaurant could not be added");
    }
}

async function getGlobalPromos() {
    return await db.any(psGetGlobalPromo)
}

const addPromo = async (promo) => {
    try {
        if(promo == null) {
            return;
        }
        promoData = [promo.startdate, promo.enddate, promo.points, promo.percentoff, promo.minspending, promo.monthswithnoorders];
        db.tx(async t =>
        {
            const q1 = await db.one(psInsertPromo, promoData);
            const q2 = await db.none(psInsertGlobalPromo, [q1.pid]);
            return t.batch([q1, q2]);
        })

    } catch (err) {
        throw (err, "Promotion could not be added");
    }
}

const editPromo = async (promo) => {
    try {
        if(promo == null) {
            return;
        }
        promoData = [promo.pid, promo.startdate, promo.enddate, promo.points, promo.percentoff, promo.minspending, promo.monthswithnoorders];
        await db.none(psEditGlobalPromo, promoData);

    } catch (err) {
        throw (err);
    }
}

async function deleteGlobalPromo(pid) {
    return await db.any(psDeleteGlobalPromo, [pid])
}



module.exports = {
    addUser, getStaffRiderList, deleteUser, addRestaurants, getGlobalPromos, addPromo, deleteGlobalPromo, editPromo
}