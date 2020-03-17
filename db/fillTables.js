const db = require('./index')

//(uid, name, username, salt, passwordHash)
const Customers = [
    [1, 'lala bin blabla', 'lalala', 'saltysplatoon', 'brown'],
    [2, 'zhow qing tian', 'zhow', 'pepper', 'asdsad'],
    [3, 'staff of wizardry', 'Knack2Babee', 'SeaSalt', '123'],
    [4, 'the fork on the left', 'oheehee', 'Mother', 'Father'],
];

//(uid, name, username, salt, passwordHash)
const Riders = [
    [5, 'Tom', 'dragon', 'password', 'password123'],
    [6, 'Bobby', 'worm', 'qwerty', '2222'],
    [7, 'Alfred', 'batman', 'ytrewq', '33333'],
    [8, 'Penny', 'penny555', 'wiwiwi', 'pppppp'],
]

//(uid, name, username, salt, passwordHash)
const Managers = [
    [9, 'Martin', 'ihaveadream', 'hehehuhu', 'huhuhehe'],
    [10, 'Victor', 'victory', 'lel1234', 'iamsecure'],
];

//(uid, name, username, salt, passwordHash, rid)
const Staffs = [
    [11, 'Macguire', 'flash', 'password11', 'safetosay', 1],
    [12, 'Pom', 'iamvegan', 'password22', 'iambatman', 2],
];

// (rid, minSpending (in cents), rname)
const Restaurants = [
    [1, 5, 'Fukuroku'],
    [2, 10, 'MaMas Specials'],
    [3, 11, 'MacDonalds'],
    [4, 15, 'KFC']
];

// (pid, points, startDate, endDate, percentOff, minSpending (in cents), monthsWithNoOrders)
const GlobalPromotions = [
    // 10% off all orders for one month with min spend $30
    [1, null, '2019-06-01', '2019-07-01', 10, 3000, null],
    [2, null, '2019-06-01', '2019-07-01', 15, 3000, 2],
    [3, 25, '2019-05-01', '2019-06-01', null, null, null],
    [4, 35, '2019-05-01', '2019-06-01', null, null, 3]
];

// (pid, rid, points, startDate, endDate, percentOff, minSpending (in cents), monthsWithNoOrders)
const RestaurantPromotions = [
    [5, 2, null, '2019-06-01', '2019-07-01', 15, 3500, null],
    [6, 2, 25, '2019-05-01', '2019-06-01', null, null, null],
    [7, 4, null, '2019-06-01', '2019-07-01', 10, 3000, 1],
    [8, 4, 10, '2019-05-01', '2019-06-01', null, null, 3]
];

const Addresses = [
    [1, '12-34', 'blk 123 admiralty ave', 123456],
    [2, '13-35', 'blk 13 thomas road', 123457],
    [3, '14-36', 'blk 23 bendemeer street', 123458],
    [4, '14-36', 'blk 23 clementi boulevard', 123459]
];

// (uid, addrId, lastUsed)
const Frequents = [
    [1, 1, '2016-01-22 19:10:25-07'],
    [2, 2, '2016-02-22 19:10:25-07'],
    [3, 3, '2016-03-22 19:10:25-07'],
    [4, 3, '2016-06-22 19:10:25-07'],
    [4, 4, '2016-07-22 19:10:25-07']
];

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

async function deleteTables() {
    try {
        await db.none(`
            DELETE From Users;
            DELETE FROM Restaurants;
            `
        );
    } catch (error) {
        console.log(error);
    }
}

async function fill() {
    await deleteTables().then(()=> console.log('Tables cleared'));

    for (const restaurant of Restaurants) {
        await addRestaurant(restaurant);
    }
    for (const customer of Customers) {
        await addCustomer(customer);
    }
    for (const rider of Riders) {
        await addRider(rider);
    }
    for (const staff of Staffs) {
        await addStaff(staff);
    }
    for (const manager of Managers) {
        await addManager(manager);
    }
    for (const promo of GlobalPromotions) {
        await addGlobalPromotion(promo);
    }
    for (const promo of RestaurantPromotions) {
        await addRestaurantPromotion(promo);
    }
    for (const addr of Addresses) {
        await addAddress(addr);
    }
    for (const rec of Frequents) {
        await addFrequents(rec);
    }
};

fill().then(() => console.log('Tables filled'));
