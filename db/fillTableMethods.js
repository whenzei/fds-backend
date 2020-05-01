const db = require('./index');


async function addCustomer(arr) {
    try {
        await db.tx(async t => {
            // creating a sequence of transaction queries:
            const q1 = await t.one(
                `Insert into Users (name, userName, salt, passwordhash) Values
                ('${arr[2]}', '${arr[3]}', '${arr[4]}', '${arr[5]}') RETURNING uid`, a => a.uid);
            const q2 = await t.none(`Insert into Customers (uid, points) Values
                    (${q1.uid}, ${arr[6]})`);
            // returning a promise that determines a successful transaction:
            return t.batch([q1, q2]); // all of the queries are to be resolved;
        });
    } catch (error) {
        console.log(error, "Failed to add customer");
    }
}
async function addRider(arr) {
    try {
        await db.tx(async t => {
            // creating a sequence of transaction queries:
            const q1 = await t.one(
                `Insert into Users (name, userName, salt, passwordhash) Values
                ('${arr[2]}', '${arr[3]}', '${arr[4]}', '${arr[5]}') RETURNING uid`, a => a.uid);
            const q2 = await t.none(
                `Insert into Riders (uid) Values
                (${q1.uid})`);
            return t.batch([q1, q2]); // all of the queries are to be resolved;
        });
    } catch (error) {
        console.log(error, 'Failed to add Rider');
        throw error
    }

}

async function addFullTimer(arr) {
    try {
        await db.none(`Insert into FullTimers values (${arr[0]})`)
    } catch (error) {
        console.log(error, 'Failed to add Full Timer');
    }
}

async function addPartTimer(arr) {
    try {
        await db.none(`Insert into PartTimers values (${arr[0]})`)
    } catch (error) {
        console.log(error, 'Failed to add Part Timer');
    }
}

async function addManager(arr) {
    try {
        await db.tx(async t => {
            // creating a sequence of transaction queries:
            const q1 = await t.one(
                `Insert into Users (name, userName, salt, passwordhash) Values
                ('${arr[2]}', '${arr[3]}', '${arr[4]}', '${arr[5]}') RETURNING uid`, a => a.uid);
            const q2 = await t.none(
                `Insert into Managers (uid) Values
                (${q1.uid})`);
            return t.batch([q1, q2]); // all of the queries are to be resolved;
        });
    } catch (error) {
        console.log(error, 'Failed to add manager')
    }

}

async function addStaff(arr) {
    try {
        await db.tx(async t => {
            // creating a sequence of transaction queries:
            const q1 = await t.one(
                `Insert into Users (name, userName, salt, passwordhash) Values
                ('${arr[2]}', '${arr[3]}', '${arr[4]}', '${arr[5]}') RETURNING uid`, a => a.uid);
            const q2 = await t.none(
                `Insert into Staff (uid, rid) Values
                (${q1.uid}, ${arr[6]})`);
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
            `Insert into Restaurants (rid, minSpending, rname, addrId) Values
            (${arr[0]}, '${arr[1]}', '${arr[2]}', ${arr[3]})`
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
        await db.tx(async t => {
            const q1 = await t.one(
                `Insert into Promotions (points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders) Values
                (${arr[2]}, '${arr[3]}', '${arr[4]}', ${arr[5]}, ${arr[6]}, ${arr[7]}) RETURNING pid`, a => a.pid);
            const q2 = await t.none(
                `Insert into GlobalPromos (pid) Values
                (${q1.pid})`);
            return t.batch([q1, q2]);
        });
    } catch (error) {
        console.log(error, 'Failed to add global promotions');
    }
}

async function addRestaurantPromotion(arr) {
    try {
        await db.tx(async t => {
            const q1 = await t.one(
                `Insert into Promotions (points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders) Values
                (${arr[3]}, '${arr[4]}', '${arr[5]}', ${arr[6]}, ${arr[7]}, ${arr[8]}) RETURNING pid`, a => a.pid);
            const q2 = await t.none(
                `Insert into RestaurantPromos (pid, rid) Values
                (${q1.pid}, ${arr[2]})`);
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

async function addShifts(arr) {
    try {
        await db.none(
            `Insert into Shifts (starttime1, endtime1, starttime2, endtime2) Values
            (${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]})`
        );
    } catch (error) {
        console.log(error, 'Failed to add shifts');
    }
}

async function addFTSchedule(arr) {
    try {
        await db.none(
            `Insert into FTSchedules (scheduleId, uid, month, year, startDayOfMonth) Values
            (${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]}, ${arr[4]})`
        );
    } catch (error) {
        console.log(error, 'Failed to add ftschedule');
    }
}


async function addConsist(arr) {
    try {
        await db.none(
            `Insert into Consists (scheduleId, relativeDay, shiftId) Values
            (${arr[0]}, '${arr[1]}', ${arr[2]})`
        );
    } catch (error) {
        console.log(error, 'Failed to add consists');
    }
}

async function addReview(arr) {
    try {
        await db.none(
            `Insert into Reviews (oid, comment, stars, date) VALUES
            (${arr[0]}, '${arr[1]}', ${arr[2]}, '${arr[3]}')`);
    } catch (error) {
        console.log(error, 'Failed to add reviews')
    }
}

async function addRating(arr) {
    try {
        await db.none(
            `Insert into Ratings (oid, value, date) VALUES
            (${arr[0]}, ${arr[1]}, '${arr[2]}')`);
    } catch (error) {
        console.log(error, 'Failed to add reviews')
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
            DELETE FROM Shifts;
            `
        );
    } catch (error) {
        console.log(error);
    }
}

async function addRate(arr) {
    return db.none(`
        insert into rates values (${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]})
    `).catch(e => {
        console.log("Failed to insert into Rates")
        throw e
    })
}

async function addPayout(arr) {
    return db.none(`
        insert into Payout values (${arr[0]}, '${arr[1]}', '${arr[2]}', '${arr[3]}', ${arr[4]}, ${arr[5]}, ${arr[6]} )
    `).catch(e => {
        console.log("Failed to insert into Payout")
        throw e
    })
}

async function addReceive(arr) {
    return db.none(`
        insert into Receives values (${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]})
    `).catch(e => {
        console.log("Failed to insert into Receives")
        throw e
    })
}

module.exports = {
    addCustomer, addRider, addStaff, addManager, addRestaurant, addFood,
    addGlobalPromotion, addRestaurantPromotion, addAddress, addFrequents,
    addCollates, addOrders, deleteTables, addShifts, addFullTimer, addConsist,
    addFTSchedule, addRating, addReview, addPartTimer, addRate, addPayout, addReceive
};