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
    [3, 11, 'WacDonalds'],
    [4, 15, 'KFC']
];

`
0)Western 
1)Chinese
2)Japanese 
3)Indonesian
4)Korean
5)Indian
6)Mediterranean
7)Thai
8)Vietnamese
9)Lebanese
`
// (rid, fname, price, category, dailyLimit)
const Food = [
    [1, 'Fried Rice', 'Chinese', '500', '200'],
    [1, 'Chow Mein', 'Chinese', '500', '200'],
    [1, 'Hor Fun', 'Chinese', '600', '300'],
    [1, 'Chicken Congee', 'Chinese', '400', '100'],
    [1, 'Tomyum Soup', 'Thai', '600', '150'],
    [1, 'Pad Thai', 'Thai', '300', '150'],
    [1, 'Basil Chicken Rice', 'Thai', '650', '100'],
    [2, 'Chicken Chop', 'Western', '600', '100'],
    [2, 'Pork Chop', 'Western', '700', '100'],
    [2, 'Fish n Chips', 'Western', '700', '100'],
    [2, 'Mediterranean Burrito', 'Mediterranean', '500', '200'],
    [2, 'Baked Cod', 'Mediterranean', '900', '50'],
    [2, 'Chicken Shawarma', 'Mediterranean', '900', '100'],
    [2, 'Seafood Paella', 'Mediterranean', '800', '100'],
    [3, 'WcSpicy', 'Western', '400', '300'],
    [3, 'WcChicken', 'Western', '300', '300'],
    [3, 'WcFillet', 'Western', '400', '200'],
    [3, 'WcBeef', 'Western', '500', '300'],
    [4, 'Mushroom Burger', 'Western', '300', '200'],
    [4, 'Chicken Burger', 'Western', '400', '300'],
    [4, '2pc Chicken', 'Western', '600', '400'],
]

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

// (fname, rid, oid, totalPrice, qty)
const Collates = [
    ['Fried Rice', 1, 1, '1000', '2'],
    ['Chow Mein', 1, 1, '500', '1'],
    ['Chow Mein', 1, 2, '500', '1'],
    ['Chicken Congee', 1, 2, '400', '1'],
    ['Hor Fun', 1, 3, '1200', '2'],
    ['Chicken Chop', 2, 4, '1800', '3'],
    ['Pork Chop', 2, 4, '700', '1']
];

// (oid, riderId, customerId, orderTime, deliveredTime, deliveryFee, isDeliveryFeeWaived, departForR, arriveAtR, departFromR, finalPrice, addrId, pid)
const Orders = [
    [1, 5, 2, '2004-10-19 10:23:54', '2004-10-19 12:23:54', 2, false, '2004-10-19 12:00:54', '2004-10-19 12:05:54', '2004-10-19 12:15:54', 1500, 1, null],
    [2, 6, 2, '2004-10-19 10:23:54', '2004-10-19 12:23:54', 2, false, '2004-10-19 12:00:54', '2004-10-19 12:05:54', '2004-10-19 12:15:54', 900, 1, null],
    [3, 6, 2, '2019-10-19 10:23:54', '2019-10-19 12:23:54', 3, false, '2019-10-19 12:00:54', '2019-10-19 12:05:54', '2019-10-19 12:15:54', 1200, 2, null],
    [4, 7, 2, '2019-10-01 10:23:54', '2019-10-01 12:23:54', 3, false, '2019-10-01 12:00:54', '2019-10-01 12:05:54', '2019-10-01 12:15:54', 2500, 2, null]
    // deliveredTime = null signifies an incomplete order. unable to represent it here because statement will be prepared as 'null' string causing DateTimeParse error
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

async function fill() {
    await deleteTables().then(()=> console.log('Tables cleared'));

    for (const restaurant of Restaurants) {
        await addRestaurant(restaurant);
    }
    for (const food of Food) {
        await addFood(food);
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
    for (const addr of Addresses) {
        await addAddress(addr);
    }
    for (const rec of Frequents) {
        await addFrequents(rec);
    }
    for (const promo of GlobalPromotions) {
        await addGlobalPromotion(promo);
    }
    for (const promo of RestaurantPromotions) {
        await addRestaurantPromotion(promo);
    }
    for (const order of Orders) {
        await addOrders(order);
    }
    for (const collate of Collates) {
        await addCollates(collate);
    }
};

fill().then(() => console.log('Tables filled'));
