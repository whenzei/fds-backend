const db = require('./index');


async function addCustomer(arr) {
    try {
        await db.tx(t => {
            // creating a sequence of transaction queries:
            const q1 = t.none(
                `Insert into Users (uid, name, userName, salt, passwordhash) Values
                (${arr[0]}, '${arr[1]}', '${arr[2]}', '${arr[3]}', '${arr[4]}')`);
        const q2 = t.none(`Insert into Customers (uid) Values
                    (${arr[0]})`);
        // returning a promise that determines a successful transaction:
        return t.batch([q1, q2]); // all of the queries are to be resolved;
    });
    } catch (error) {
        console.log(error, "Failed to add customer");
    }
}
async function addRider(arr) {
    try {
        await db.tx(t => {
            // creating a sequence of transaction queries:
            const q1 = t.none(
                `Insert into Users (uid, name, userName, salt, passwordhash) Values
                (${arr[0]}, '${arr[1]}', '${arr[2]}', '${arr[3]}', '${arr[4]}')`);
        const q2 = t.none(
            `Insert into Riders (uid) Values
                (${arr[0]})`);
        return t.batch([q1, q2]); // all of the queries are to be resolved;
    });
    } catch (error) {
        console.log(error, 'Failed to add Rider');
    }

}

async function addManager(arr) {
    try {
        await db.tx(t => {
            // creating a sequence of transaction queries:
            const q1 = t.none(
                `Insert into Users (uid, name, userName, salt, passwordhash) Values
                (${arr[0]}, '${arr[1]}', '${arr[2]}', '${arr[3]}', '${arr[4]}')`);
        const q2 = t.none(
            `Insert into Managers (uid) Values
                (${arr[0]})`);
        return t.batch([q1, q2]); // all of the queries are to be resolved;
    });
    } catch (error) {
        console.log(error, 'Failed to add manager')
    }

}

async function addStaff(arr) {
    try {
        await db.tx(t => {
            // creating a sequence of transaction queries:
            const q1 = t.none(
                `Insert into Users (uid, name, userName, salt, passwordhash) Values
                (${arr[0]}, '${arr[1]}', '${arr[2]}', '${arr[3]}', '${arr[4]}')`);
        const q2 = t.none(
            `Insert into Staff (uid, rid) Values
                (${arr[0]}, ${arr[5]})`);
        return t.batch([q1, q2]); // all of the queries are to be resolved;
    });
    } catch (error) {
        console.log(error, 'Failed to add staff');
        throw (error)
    }
}

async function addRestaurant(arr) {
    try {
        await db.none(
            `Insert into Restaurants (rid, minSpending, rname) Values
            (${arr[0]}, '${arr[1]}', '${arr[2]}')`
        );
    } catch (error) {
        console.log(error, 'Failed to add restaurant');
    }
}

async function addFood(arr) {
    try {
        await db.none(
            `Insert into Food (rid, fname, category, price, dailyLimit) Values
            (${arr[0]}, '${arr[1]}', '${arr[2]}', '${arr[3]}', '${arr[4]}')`
        );
    } catch (error) {
        console.log(error, 'Failed to add food');
    }
}

async function addGlobalPromotion(arr) {
    try {
        await db.tx(t => {
            const q1 = t.none(
                `Insert into Promotions (pid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders) Values
                (${arr[0]}, ${arr[1]}, '${arr[2]}', '${arr[3]}', ${arr[4]}, ${arr[5]}, ${arr[6]})`);
        const q2 = t.none(
            `Insert into GlobalPromos (pid) Values
                (${arr[0]})`);
        return t.batch([q1, q2]);
    });
    } catch (error) {
        console.log(error, 'Failed to add global promotions');
    }
}

async function addRestaurantPromotion(arr) {
    try {
        await db.tx(t => {
            const q1 = t.none(
                `Insert into Promotions (pid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders) Values
                (${arr[0]}, ${arr[2]}, '${arr[3]}', '${arr[4]}', ${arr[5]}, ${arr[6]}, ${arr[7]})`);
        const q2 = t.none(
            `Insert into RestaurantPromos (pid, rid) Values
                (${arr[0]}, ${arr[1]})`);
        return t.batch([q1, q2]);
    });
    } catch (error) {
        console.log(error, 'Failed to add restaurant promotions');
    }
}

async function addAddress(arr) {
    try {
        await db.none(
            `Insert into Address (addrId, unit, streetname, postalCode) Values
            (${arr[0]}, '${arr[1]}', '${arr[2]}', ${arr[3]})`
        );
    } catch (error) {
        console.log(error, 'Failed to add address')
    }
}

async function addFrequents(arr) {
    try {
        await db.none(
            `Insert into Frequents (uid, addrId, lastUsed) Values
            (${arr[0]}, ${arr[1]}, '${arr[2]}')`
        );
    } catch (error) {
        console.log(error, 'Failed to add record to Frequents')
    }
}

async function addCollates(arr) {
    try {
        await db.none(
            `Insert into Collates (fname, rid, oid, totalPrice, qty) Values
            ('${arr[0]}', ${arr[1]}, ${arr[2]}, '${arr[3]}', '${arr[4]}')`
        );
    } catch (error) {
        console.log(error, 'Failed to add collate');
    }
}

async function addOrders(arr) {
    try {
        await db.none(
            `Insert into Orders (oid, riderId, customerId, orderTime, deliveredTime, deliveryFee, isDeliveryFeeWaived, departForR, arriveAtR, departFromR, finalPrice, addrId, pid) Values
            (${arr[0]}, ${arr[1]}, ${arr[2]}, '${arr[3]}', '${arr[4]}', ${arr[5]}, ${arr[6]}, '${arr[7]}', '${arr[8]}', '${arr[9]}', ${arr[10]}, ${arr[11]}, ${arr[12]})`
        );
    } catch (error) {
        console.log(error, 'Failed to add orders');
    }
}

async function deleteTables() {
    try {
        await db.none(`
            DELETE FROM Frequents;
            DELETE FROM Address;
            DELETE FROM Users;
            DELETE FROM Food;
            DELETE FROM Promotions;
            DELETE FROM Restaurants;
            DELETE FROM Orders;
            DELETE FROM Collates;
            `
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addCustomer, addRider, addStaff, addManager, addRestaurant, addFood,
    addGlobalPromotion, addRestaurantPromotion, addAddress, addFrequents, addCollates, addOrders, deleteTables
};