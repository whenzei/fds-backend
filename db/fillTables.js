const { addCustomer, addRider, addStaff, addManager, addRestaurant, addFood,
    addGlobalPromotion, addRestaurantPromotion, addAddress, addFrequents, addCollates, addOrders, deleteTables, addShifts, addFTSchedule, addConsist, addFullTimer } = require('../db/fillTableMethods');

//(uid, name, username, salt, passwordHash)
const Customers = [
    [1, 'lala bin blabla', 'lalala', 'saltysplatoon', 'brown', 300],
    [2, 'zhow qing tian', 'zhow', 'pepper', 'asdsad', 1000],
    [3, 'staff of wizardry', 'Knack2Babee', 'SeaSalt', '123', 500],
    [4, 'the fork on the left', 'oheehee', 'Mother', 'Father', 20000],
];

//(uid, name, username, salt, passwordHash)
const Riders = [
    [5, 'Tom', 'dragon', 'password', 'password123'],
    [6, 'Bobby', 'worm', 'qwerty', '2222'],
    [7, 'Alfred', 'batman', 'ytrewq', '33333'],
    [8, 'Penny', 'penny555', 'wiwiwi', 'pppppp'],
]

//(uid)
const FullTimers = [
    [5],
    [6],
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
    [1, null, '2018-06-01', '2019-07-01', 10, 1000, null],
    [2, null, '2019-06-01', '2019-07-01', 10, 3000, null],
    [3, null, '2019-06-01', '2019-07-01', 15, 3000, 2],
    [4, 25, '2019-05-01', '2019-06-01', null, null, null],
    [5, 35, '2019-05-01', '2019-06-01', null, null, 3]
];

// (pid, rid, points, startDate, endDate, percentOff, minSpending (in cents), monthsWithNoOrders)
const RestaurantPromotions = [
    [6, 2, null, '2019-06-01', '2019-07-01', 15, 3500, null],
    [7, 2, null, '2019-06-01', '2019-07-01', 15, 3500, null],
    [8, 2, 25, '2019-05-01', '2019-06-01', null, null, null],
    [9, 4, null, '2019-06-01', '2019-07-01', 10, 3000, 1],
    [10, 2, 10, '2019-05-01', '2019-11-01', null, null, 3],
    [11, 2, 10, '2019-10-01', '2019-12-01', null, null, null]
];

const Addresses = [
    [1, '12-34', '77 TREVOSE CRESCENT', 298091],
    [2, '13-35', '512A THOMSON ROAD', 298137],
    [3, '05-12', '11A NAROOMA ROAD DUNEARN ESTATE', 298306],
    [4, '14-36', '37 BEECHWOOD GROVE', 738236],
    [5, '09-11', '56 WOODGROVE WALK CENTURY WOODS', 738199],
    [6, '03-22', '47 YUK TONG AVENUE', 596348],
    [7, '05-55', '93B DUNBAR WALK', 459446],
    [8, '05-11', '35 EAST COAST AVENUE', 459240]
];

// (uid, addrId, lastUsed)
const Frequents = [
    [1, 1, '2020-01-20 19:10:25-07'],
    [2, 5, '2020-01-21 19:10:25-07'],
    [2, 6, '2020-01-22 19:10:25-07'],
    [2, 7, '2020-01-23 19:10:25-07'],
    [2, 8, '2020-01-24 19:10:25-07'],
    [2, 2, '2020-01-20 19:10:25-07'],
    [3, 3, '2020-01-22 19:10:25-07'],
    [4, 3, '2020-01-23 19:10:25-07'],
    [4, 4, '2020-03-01 19:10:25-07']
];

// (fname, rid, oid, totalPrice, qty)
const Collates = [
    // oid = 1
    ['Fried Rice', 1, 1, '1000', '2'],
    ['Chow Mein', 1, 1, '500', '1'],

    // oid = 2
    ['Chow Mein', 1, 2, '500', '1'],
    ['Chicken Congee', 1, 2, '400', '1'],

    // oid = 3
    ['Hor Fun', 1, 3, '1200', '2'],

    // oid = 4
    ['Chicken Chop', 2, 4, '1800', '3'],
    ['Pork Chop', 2, 4, '700', '1'],

    // oid = 5
    ['Fish n Chips', 2, 5, '700', '1'],
    ['Mediterranean Burrito', 2, 5, '500', '1'],
    ['Pork Chop', 2, 5, '700', '1'],

    // oid = 6
    ['Baked Cod', 2, 6, '1800', '2'],
    ['Chicken Shawarma', 2, 6, '900', '1'],
    ['Seafood Paella', 2, 6, '800', '1']
];

// (oid, riderId, customerId, orderTime, deliveredTime, deliveryFee, isDeliveryFeeWaived, departForR, arriveAtR, departFromR, finalPrice, addrId, pid)
const Orders = [
    [1, 8, 2, '2018-10-19 10:23:54', '2018-10-19 12:23:54', 2, false, '2018-10-19 12:00:54', '2018-10-19 12:05:54', '2018-10-19 12:15:54', 1500, 1, 1],
    [2, 7, 2, '2018-10-19 10:23:54', '2018-10-19 12:23:54', 2, false, '2018-10-19 12:00:54', '2018-10-19 12:05:54', '2018-10-19 12:15:54', 900, 1, null],
    [3, 6, 2, '2018-11-19 10:23:54', '2018-11-19 12:23:54', 2, false, '2018-11-19 12:00:54', '2018-11-19 12:05:54', '2018-11-19 12:15:54', 1200, 1, null],
    [4, 6, 2, '2019-10-01 10:23:54', '2019-10-01 12:23:54', 3, false, '2019-10-01 12:00:54', '2019-10-01 12:05:54', '2019-10-01 12:15:54', 2500, 2, 11],
    [5, 7, 2, '2019-10-19 10:23:54', '2019-10-19 12:23:54', 3, false, '2019-10-19 12:00:54', '2019-10-19 12:05:54', '2019-10-19 12:15:54', 1900, 2, 11],
    [6, 8, 3, '2019-10-20 10:23:54', '2019-10-20 12:23:54', 3, false, '2019-10-20 12:00:54', '2019-10-20 12:05:54', '2019-10-20 12:15:54', 3500, 4, 10]
    // deliveredTime = null signifies an incomplete order. unable to represent it here because statement will be prepared as 'null' string causing DateTimeParse error
];

// (shiftid, starttime1, endtime1, starttime2, endtime2)
const Shifts = [
    [1, 10, 14, 15, 19],
    [2, 11, 15, 16, 20],
    [3, 12, 16, 17, 21],
    [4, 13, 17, 18, 22],
]

// (scheduleId, uid, month, year, startDayOfMonth)
const FTSchedules = [
    [1, 5, 3, 2020, 2],
    [2, 6, 2, 2020, 3],
]

// (scheduleid, relativeDay, shiftId)
const Consists = [
    [1, 0, 4],
    [1, 1, 3],
    [1, 2, 1],
    [1, 3, 4],
    [1, 4, 2],
]

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
    for (const fullTimer of FullTimers) {
        await addFullTimer(fullTimer);
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
    for (const shift of Shifts) {
        await addShifts(shift)
    }
    for (const schedule of FTSchedules) {
        await addFTSchedule(schedule)
    }
    for (const consist of Consists) {
        await addConsist(consist)
    }
};

fill().then(() => console.log('Tables filled'));