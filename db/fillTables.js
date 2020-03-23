const { addCustomer, addRider, addStaff, addManager, addRestaurant, addFood,
    addGlobalPromotion, addRestaurantPromotion, addAddress, addFrequents, deleteTables } = require('../db/fillTableMethods');

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