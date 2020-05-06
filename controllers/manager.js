const db = require('../db');
const PS = require('pg-promise').PreparedStatement;
const { Roles } = require('../auth/index');
const { getNextUid } = require('../controllers/user');
const { addRider, addStaff, addRestaurant, addGlobalPromotion } = require('../db/fillTableMethods');

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
            staffData = [null, 'S', user.name, user.username, 'salt', user.password, user.rid];
            await addStaff(staffData);
        } else if (user.role == Roles.rider){
            riderData = [null, 'R', user.name, user.username, 'salt', user.password];
            await addRider(riderData);
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
        restData = [null, parseInt(restaurant.minspending), restaurant.rname,parseInt(restaurant.addrid)];
        await addRestaurant(restData);
        
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
        const q1 = await db.one(psInsertPromo, promoData);
        await db.none(psInsertGlobalPromo, [q1.pid]);

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