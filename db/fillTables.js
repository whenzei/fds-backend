const { addRate, addPayout, addReceive, addCustomer, addRider, addStaff, addManager, addRestaurant, addFood,
    addGlobalPromotion, addRestaurantPromotion, addAddress,
    addFrequents, addCollates, addOrders, deleteTables, addShifts,
    addFTSchedule, addConsist, addFullTimer, addReview, addRating, addPartTimer } = require('../db/fillTableMethods');
const { generate_payouts_receives_rates } = require('./payout_generator')
const db = require('./index');

//(uid, name, username, salt, passwordHash)
const Customers = [
    [1, 'C', 'lala bin blabla', 'lalala', 'saltysplatoon', 'brown', 300],
    [2, 'C', 'zhow qing tian', 'zhow', 'pepper', 'asdsad', 1000],
    [3, 'C', 'staff of wizardry', 'Knack2Babee', 'SeaSalt', '123', 500],
    [4, 'C', 'the fork on the left', 'oheehee', 'Mother', 'Father', 20000],
    [13, 'C', 'John Doe', 'jdoe', 'please', 'password', 20000],
    [14, 'C', 'Tan Ah Kau', 'tahkau', 'give', 'password', 20000],
    [15, 'C', 'Lim Bee Bee', 'lbeebee', 'me', 'password', 5000],
    [16, 'C', 'Kamal Lama', 'kamalama', 'an', 'password', 5000],
    [17, 'C', 'Jaleney', 'jujuje', 'A', 'password', 10000],
    [18, 'C', 'Lu Lu', 'lulu', 'for', 'password', 20000],
    [19, 'C', 'Hebe Fu', 'youthefool', 'this', 'password', 15000],
    [20, 'C', 'Shimmy shammy', 'shimsham', 'module', 'password', 20000]
];

//(uid, name, username, salt, passwordHash)
const Riders = [
    [5, 'R', 'Tom', 'dragon', 'password', 'password123'],
    [6, 'R', 'Bobby', 'worm', 'qwerty', '2222'],
    [7, 'R', 'Alfred', 'batman', 'ytrewq', '33333'],
    [8, 'R', 'Penny', 'penny555', 'wiwiwi', 'pppppp'],
]

//(uid)
const FullTimers = [
    [5],
    [6],
]

//(uid)
const PartTimers = [
    [7],
    [8],
]

const [Rates, Payouts, Receives] = generate_payouts_receives_rates(FullTimers, PartTimers, 2019, 1, 16, 12, 10)

//(uid, name, username, salt, passwordHash)
const Managers = [
    [9, 'M', 'Martin', 'ihaveadream', 'hehehuhu', 'huhuhehe'],
    [10, 'M', 'Victor', 'victory', 'lel1234', 'iamsecure'],
];

//(uid, name, username, salt, passwordHash, rid)
const Staffs = [
    [11, 'S', 'Macguire', 'flash', 'password11', 'safetosay', 1],
    [12, 'S', 'Pom', 'iamvegan', 'password22', 'iambatman', 2],
];

// (minSpending (in cents), rname)
const Restaurants = [
    // rid 1 
    [500, 'Fukuroku', 6],
    // rid 2
    [1000, 'MaMas Specials', 7],
    // rid 3
    [1100, 'WacDonalds', 8],
    // rid 4
    [1500, 'KFC', 5],
    // rid 5
    [1000, 'Asian Kitchen', 9],
    // rid 6
    [500, 'La Fela', 10],
    // rid 7
    [500, 'Bobby BBQ', 11],
    // rid 8
    [1000, 'Asian Fusion', 12],
    // rid 9
    [1500, 'Tempura Don', 13],
    // rid 10
    [1500, 'Ramen House', 14],
    // rid 11
    [1000, 'Sushi Craze', 15],
    // rid 12
    [1000, 'Vietnam Hut', 16],
    // rid 13
    [800, 'Fu Zhou Eatery', 17],
    // rid 14
    [600, 'North Indian Delights', 18],
    // rid 15
    [500, 'Kimchi Love', 19],
    // rid 16
    [1000, 'Nakon House', 20],
    // rid 17
    [1000, 'Grill N Meal', 21],
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
    [1, 'Tom Yum Soup', 'Thai', '600', '150'],
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
    [5, 'Omelette Rice', 'Chinese', '300', '400'],
    [5, 'Mala Chicken Set', 'Chinese', '600', '200'],
    [5, 'Cantonese Beef Rice', 'Chinese', '500', '400'],
    [5, 'Teochew Noodle', 'Chinese', '400', '400'],
    [5, 'Hokkien Mee', 'Chinese', '500', '300'],
    [5, 'Spring Rolls x5', 'Chinese', '400', '200'],
    [6, 'Cream Fusili', 'Western', '400', '200'],
    [6, 'Aglio Olio', 'Western', '400', '200'],
    [6, 'Aglio Olio With Salmon', 'Western', '700', '200'],
    [6, 'Pepporoni Pizza', 'Western', '800', '200'],
    [6, 'English Breakfast', 'Western', '700', '200'],
    [6, 'Smoked Salmon', 'Western', '1000', '200'],
    [7, 'BBQ Pork Ribs', 'Western', '1100', '200'],
    [7, 'BBQ Sirloin', 'Western', '1000', '200'],
    [7, 'BBQ Ribeye', 'Western', '1200', '200'],
    [7, 'Truffle Fries', 'Western', '700', '200'],
    [7, 'Honey Chicken Wings', 'Western', '800', '200'],
    [7, 'Cheese Fries', 'Western', '800', '200'],
    [8, 'Chicken Fusion Bowl', 'Chinese', '900', '200'],
    [8, 'Chicken Fusion Noodle', 'Chinese', '800', '200'],
    [8, 'Beef Bowl', 'Chinese', '1000', '200'],
    [8, 'Salmon n Beef Bowl', 'Chinese', '1500', '100'],
    [8, 'Wagyu Bowl', 'Western', '2000', '100'],
    [8, 'Healthy Salmon Bowl', 'Western', '2500', '100'],
    [8, 'Fusion Bowl', 'Western', '2500', '100'],
    [8, 'Original Beef Bowl', 'Western', '2000', '100'],
    [8, 'Spicy Special Bowl', 'Western', '1900', '100'],
    [8, 'House Recipe Salmon', 'Western', '2500', '100'],
    [9, 'Original Tendon', 'Japanese', '1500', '400'],
    [9, 'Ebi Tendon', 'Japanese', '1500', '400'],
    [9, 'Mentaiko Special Tendon', 'Japanese', '2000', '400'],
    [9, 'Spicy Mix Don', 'Japanese', '2000', '400'],
    [9, 'Kakiage Don', 'Japanese', '1000', '400'],
    [10, 'Chashu Ramen', 'Japanese', '1200', '400'],
    [10, 'Squid Ink Ramen', 'Japanese', '1000', '400'],
    [10, 'Original Ramen', 'Japanese', '1400', '400'],
    [10, 'Spicy Chashu Ramen', 'Japanese', '1500', '100'],
    [10, 'Hokkaido Ramen', 'Japanese', '1400', '200'],
    [10, 'Soba Special', 'Japanese', '1200', '100'],
    [11, 'Dragon Roll', 'Japanese', '700', '300'],
    [11, 'Mango Roll', 'Japanese', '900', '200'],
    [11, 'Inari Roll', 'Japanese', '400', '150'],
    [11, 'Salmon Gunkan', 'Japanese', '500', '200'],
    [11, 'Tamago Gunkan', 'Japanese', '300', '200'],
    [11, 'Lobster Gunkan', 'Japanese', '500', '200'],
    [11, 'Salmon Sashimi', 'Japanese', '600', '400'],
    [11, 'Salmon Mentaiko', 'Japanese', '700', '200'],
    [11, 'Tuna Sashimi', 'Japanese', '600', '300'],
    [11, 'Tempura', 'Japanese', '600', '200'],
    [11, 'Chawanmushi', 'Japanese', '300', '400'],
    [11, 'Crab Meat Chawanmushi', 'Japanese', '500', '300'],
    [11, 'Agedashi Tofu', 'Japanese', '400', '300'],
    [12, 'Banh Xeo', 'Vietnamese', '600', '300'],
    [12, 'Cha Ca', 'Vietnamese', '600', '300'],
    [12, 'Cao Lau', 'Vietnamese', '500', '300'],
    [12, 'Pho Xao', 'Vietnamese', '700', '300'],
    [12, 'Banh Cuon', 'Vietnamese', '500', '200'],
    [12, 'Bun Ca Cay', 'Vietnamese', '400', '300'],
    [12, 'Ban Canh He', 'Vietnamese', '700', '100'],
    [12, 'Com Goi La Sen', 'Vietnamese', '800', '200'],
    [13, 'Ding Bian Hu', 'Chinese', '800', '200'],
    [13, 'Gua Bao', 'Chinese', '800', '200'],
    [13, 'Hujiao Bing', 'Chinese', '300', '200'],
    [13, 'Fish Ball Noodle', 'Chinese', '700', '200'],
    [13, 'Li Bing', 'Chinese', '600', '200'],
    [13, 'Qi Jiguang Cake', 'Chinese', '500', '200'],
    [14, 'Butter Chicken', 'Indian', '600', '200'],
    [14, 'Rogan Josh Recipe', 'Indian', '700', '200'],
    [14, 'Fish Amritsari', 'Indian', '800', '200'],
    [14, 'Lacha Paratha', 'Indian', '400', '200'],
    [14, 'Mutter Paneer', 'Indian', '600', '200'],
    [14, 'Rajma Dal', 'Indian', '600', '200'],
    [14, 'Kheer', 'Indian', '400', '200'],
    [15, 'Kimchi Fried Rice', 'Korean', '550', '200'],
    [15, 'Kimchi Ramen', 'Korean', '550', '200'],
    [15, 'Spicy Chicken Hotplate', 'Korean', '550', '200'],
    [15, 'Bulgogi', 'Korean', '600', '200'],
    [15, 'Ginseng Chicken', 'Korean', '700', '200'],
    [15, 'Bibimbap', 'Korean', '700', '200'],
    [15, 'Beef Hotplate', 'Korean', '800', '200'],
    [16, 'Green Curry', 'Thai', '900', '200'],
    [16, 'Basil Pork Rice', 'Thai', '800', '300'],
    [16, 'Stir Fried Beef', 'Thai', '800', '200'],
    [16, 'Sticky Mango Rice', 'Thai', '600', '400'],
    [16, 'Tom Yum Fried Rice', 'Thai', '700', '300'],
    [16, 'Spicy Salad', 'Thai', '300', '200'],
    [16, 'Stir-fried Pumpkin', 'Thai', '500', '200'],
    [17, 'Sticks N Bones', 'Western', '1000', '200'],
    [17, 'Finger Licking Wings', 'Western', '800', '200'],
    [17, 'Pork Knuckle', 'Western', '1800', '200'],
    [17, 'Steaks for 2', 'Western', '1200', '100'],
    [17, 'Grilled Fish', 'Western', '1000', '200'],
    [17, 'House Grilled Chicken', 'Western', '1900', '200'],
]

// (pid, points, startDate, endDate, percentOff, minSpending (in cents), monthsWithNoOrders)
const GlobalPromotions = [
    // 10% off all orders for one month with min spend $30
    [1, 'G', 0, '2018-06-01', '2019-07-01', 10, 1000, 0],
    [2, 'G', 0, '2019-06-01', '2019-07-01', 10, 3000, 0],
    [3, 'G', 0, '2019-06-01', '2019-07-01', 15, 3000, 2],
    [4, 'G', 25, '2019-05-01', '2019-06-01', 0, 0, 0],
    [5, 'G', 35, '2019-05-01', '2019-06-01', 0, 0, 3],
    [15, 'G', 35, '2020-01-01', '2020-07-07', 10, 0, 3],
    [16, 'G', 100, '2020-01-01', '2020-09-02', 5, 0, 0],
    [17, 'G', 100, '2020-01-01', '2020-05-03', 15, 0, 2],
    [18, 'G', 50, '2020-01-01', '2020-07-07', 20, 300, 1],
    [19, 'G', 70, '2020-01-01', '2020-08-07', 25, 0, 3],
    [20, 'G', 1000, '2020-01-01', '2020-09-07', 0, 500, 0]
];

// (pid, rid, points, startDate, endDate, percentOff, minSpending (in cents), monthsWithNoOrders)
const RestaurantPromotions = [
    [6, 'R', 2, 0, '2019-06-01', '2019-07-01', 15, 3500, 0],
    [7, 'R', 2, 0, '2019-06-01', '2019-07-01', 15, 3500, 0],
    [8, 'R', 2, 25, '2019-05-01', '2019-06-01', 0, 0, 0],
    [9, 'R', 4, 0, '2019-06-01', '2019-07-01', 10, 3000, 1],
    [10, 'R', 2, 10, '2019-05-01', '2019-11-01', 0, 0, 3],
    [11, 'R', 2, 10, '2019-10-01', '2019-12-01', 0, 0, 0],
    [12, 'R', 1, 0, '2020-01-01', '2020-12-12', 20, 0, 0],
    [13, 'R', 1, 20, '2020-03-03', '2020-10-10', 10, 1000, 0],
    [14, 'R', 1, 200, '2020-02-02', '2020-09-09', 5, 0, 2],
];

const Addresses = [
    //1 
    ['12-34', '77 TREVOSE CRESCENT', 298091],
    //2
    ['13-35', '512A THOMSON ROAD', 298137],
    //3
    ['05-12', '11A NAROOMA ROAD DUNEARN ESTATE', 298306],
    //4
    ['14-36', '37 BEECHWOOD GROVE', 738236],
    //5
    ['09-11', '56 WOODGROVE WALK CENTURY WOODS', 738199],
    //6
    ['03-22', '47 YUK TONG AVENUE', 596348],
    //7
    ['05-55', '93B DUNBAR WALK', 459446],
    //8
    ['05-11', '35 EAST COAST AVENUE', 459240],
    //9
    ['20-10', '361A TAMPINES STREET 34', 521361],
    //10
    ['03-17', '37F LORONG STANGEE', 425018],
    //11
    ['07-02', '8 HAPPY AVENUE NORTH', 369756],
    //12
    ['11-23', '6 JALAN SOO BEE', 488129],
    //13
    ['04-31', '5 WILKINSON ROAD', 436658],
    //14
    ['16-12', '29D POH HUAT ROAD', 546753],
    //15
    ['04-33', '477 SEGAR ROAD SEGAR GARDENS', 670477],
    //16
    ['18-01', '222 SUMANG LANE MATILDA EDGE', 820222],
    //17
    ['09-09', '4 SEA AVENUE', 424221],
    //18
    ['02-21', '36A SIAK KEW AVENUE SENNETT ESTATE', 348075],
    //19
    ['11-21', '260 JALAN BESAR', 208935],
    //20
    ['07-15', '46 TANGLIN HALT ROAD', 142046],
    //21
    ['09-19', '192A SERANGOON ROAD', 218066],
    //22
    ['15-04', '64 TAMAN NAKHODA VILLA DELLE ROSE', 257775],
    //23
    ['04-04', '304 ORCHARD ROAD UOB LUCKY PLAZA', 238863],
    //24
    ['07-07', '18 JALAN NOVENA RESIDENCES @ NOVENA', 308679],
    //25
    ['02-22', '38A LENGKONG TIGA', 417460],
    //26
    ['03-03', '7 JALAN SEAVIEW SEA VIEW PARK', 438321],
    //27
    ['10-11', '6 MARIA AVENUE OPERA ESTATE', 456738],
    //28
    ['09-08', '5 PARRY ROAD', 547190],
    //29
    ['08-15', '7 JALAN LAYANG LAYANG', 598474],
    //30
    ['05-55', '66 JALAN MALU-MALU SEMBAWANG SPRINGS ESTATE', 769681],
    //31
    ['02-02', '104 BUTTERFLY AVENUE SENNETT ESTATE', 349841]

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
    ['Fried Rice', 1, 1, '1000', 2],
    ['Chow Mein', 1, 1, '500', 1],

    // oid = 2
    ['Chow Mein', 1, 2, '500', 1],
    ['Chicken Congee', 1, 2, '400', 1],

    // oid = 3
    ['Hor Fun', 1, 3, '1200', 2],

    // oid = 4
    ['Chicken Chop', 2, 4, '1800', 3],
    ['Pork Chop', 2, 4, '700', 1],

    // oid = 5
    ['Fish n Chips', 2, 5, '700', 1],
    ['Mediterranean Burrito', 2, 5, '500', 1],
    ['Pork Chop', 2, 5, '700', 1],

    // oid = 6
    ['Baked Cod', 2, 6, '1800', 2],
    ['Chicken Shawarma', 2, 6, '900', 1],
    ['Seafood Paella', 2, 6, '800', 1],

    // oid = 7
    ['Chow Mein', 1, 7, '1500', 3],

    // oid = 8
    ['Tom Yum Soup', 1, 8, '600', 1],
    ['Pad Thai', 1, 8, '300', 1],
    ['Basil Chicken Rice', 1, 8, '650', 1],

    // oid = 9
    ['Kimchi Ramen', 15, 9, '550', 1],
    ['Spicy Chicken Hotplate', 15, 9, '1100', 2],

    // oid = 10
    ['Salmon Sashimi', 11, 10, '600', 1],
    ['Salmon Mentaiko', 11, 10, '700', 1],
    ['Tuna Sashimi', 11, 10, '600', 1],

    // oid = 11
    ['Salmon Sashimi', 11, 11, '600', 1],
    ['Tuna Sashimi', 11, 11, '600', 1],

    // oid = 12
    ['Sticks N Bones', 17, 12, '1000', 1],
    ['Finger Licking Wings', 17, 12, '800', 1],

    // oid = 13
    ['Hujiao Bing', 13, 13, '300', 1],
    ['Fish Ball Noodle', 13, 13, '700', 1],

    // oid = 14
    ['Butter Chicken', 14, 14, '600', 2],
    ['Rogan Josh Recipe', 14, 14, '700', 1],
    ['Fish Amritsari', 14, 14, '800', 1],

    // oid = 15
    ['Bibimbap', 15, 15, '700', 2],
    ['Beef Hotplate', 15, 15, '800', 3],

];

// (riderId, customerId, orderTime, deliveredTime, deliveryFee, isDeliveryFeeWaived, departForR, arriveAtR, departFromR, finalPrice, addrId, pid)
const Orders = [
    //oid 1
    [8, 2, '2018-10-19 10:23:54', '2018-10-19 12:23:54', 200, false, '2018-10-19 12:00:54', '2018-10-19 12:05:54', '2018-10-19 12:15:54', 1500, 1, 1],
    //oid 2
    [7, 2, '2018-10-19 10:23:54', '2018-10-19 12:23:54', 200, false, '2018-10-19 12:00:54', '2018-10-19 12:05:54', '2018-10-19 12:15:54', 900, 1, null],
    //oid 3
    [6, 2, '2018-11-19 10:23:54', '2018-11-19 12:23:54', 200, false, '2018-11-19 12:00:54', '2018-11-19 12:05:54', '2018-11-19 12:15:54', 1200, 1, null],
    //oid 4
    [6, 2, '2019-10-01 10:23:54', '2019-10-01 12:23:54', 300, false, '2019-10-01 12:00:54', '2019-10-01 12:05:54', '2019-10-01 12:15:54', 2500, 2, 11],
    //oid 5
    [7, 2, '2019-10-19 10:23:54', '2019-10-19 12:23:54', 300, false, '2019-10-19 12:00:54', '2019-10-19 12:05:54', '2019-10-19 12:15:54', 1900, 2, 11],
    //oid 6
    [8, 3, '2019-10-20 10:23:54', '2019-10-20 12:23:54', 300, false, '2019-10-20 12:00:54', '2019-10-20 12:05:54', '2019-10-20 12:15:54', 3500, 4, 10],
    //oid 7
    [7, 2, '2020-02-24 10:23:54', '2020-02-24 11:00:54', 300, false, '2020-02-24 10:24:54', '2020-02-24 10:40:54', '2020-02-24 10:45:54', 1500, 1, 15],
    //oid 8
    [6, 2, '2020-02-25 11:23:54', '2020-02-25 12:30:54', 300, false, '2020-02-25 11:40:54', '2020-02-25 12:00:54', '2020-02-25 12:15:54', 1550, 1, null],
    //oid 9
    [5, 13, '2020-01-10 14:23:54', '2020-01-10 14:30:54', 300, false, '2020-01-10 14:40:54', '2020-01-10 15:00:54', '2020-01-10 15:15:54', 1650, 22, null],
    //oid 10
    [6, 13, '2020-01-02 14:23:54', '2020-01-02 14:30:54', 300, false, '2020-01-02 14:40:54', '2020-01-02 15:00:54', '2020-01-02 15:15:54', 1900, 23, null],
    //oid 11
    [7, 14, '2020-01-22 14:23:54', '2020-01-22 14:30:54', 300, true, '2020-01-22 14:40:54', '2020-01-22 15:00:54', '2020-01-22 15:15:54', 900, 24, 19],
    //oid 12
    [6, 14, '2020-03-22 14:23:54', '2020-03-22 14:30:54', 300, true, '2020-03-22 14:40:54', '2020-03-22 15:00:54', '2020-03-22 15:15:54', 1440, 24, 18],
    //oid 13
    [5, 15, '2020-03-10 14:23:54', '2020-03-10 14:30:54', 300, false, '2020-03-10 14:40:54', '2020-03-10 15:00:54', '2020-03-10 15:15:54', 1000, 25, null],
    //oid 14
    [5, 15, '2020-01-02 14:23:54', '2020-01-02 14:30:54', 300, false, '2020-01-02 14:40:54', '2020-01-02 15:00:54', '2020-01-02 15:15:54', 2700, 25, 20],
    //oid 15
    [7, 16, '2020-02-02 14:23:54', '2020-02-02 14:30:54', 300, false, '2020-02-02 14:40:54', '2020-02-02 15:00:54', '2020-02-02 15:15:54', 3800, 26, null],
    // deliveredTime = null signifies an incomplete order. unable to represent it here because statement will be prepared as 'null' string causing DateTimeParse error
];

// (shiftid, starttime1, endtime1, starttime2, endtime2)
const Shifts = [
    //1
    [10, 14, 15, 19],
    //2
    [11, 15, 16, 20],
    //3
    [12, 16, 17, 21],
    //4
    [13, 17, 18, 22],
]

// (scheduleId, uid, month, year, startDayOfMonth)
const FTSchedules = [
    [1, 5, 3, 2020, 2],
    [2, 5, 2, 2020, 1],
    [3, 6, 2, 2020, 3],
]

// (scheduleid, relativeDay, shiftId)
const Consists = [
    [1, 0, 4],
    [1, 1, 3],
    [1, 2, 1],
    [1, 3, 4],
    [1, 4, 2],

    [2, 0, 2],
    [2, 1, 1],
    [2, 2, 4],
    [2, 3, 1],
    [2, 4, 3],

    [3, 0, 1],
    [3, 1, 2],
    [3, 2, 3],
    [3, 3, 4],
    [3, 4, 1],
]

// (oid, comment, stars, date)
const Reviews = [
    [1, 'Food is decent, would buy again', 4, '2018-10-19 13:50:54'],
    [2, 'Wished that the Chow Mein is spicier, otherwise all is good!', 5, '2018-10-19 13:20:22'],
    [3, 'Food is below average', 2, '2018-11-19 14:10:22'],
    [4, 'One of the best places for Chicken Chop', 5, '2019-10-01 16:10:54'],
    [5, '', 5, '2019-10-19 14:44:54'],
    [6, 'Average food', 3, '2019-10-20 16:23:22'],
    [7, 'Pretty good for the price', 5, '2020-02-24 18:21:11'],
]

// (oid, value, date)
const Ratings = [
    [1, 5, '2018-10-19 13:51:54'],
    [2, 4, '2018-10-19 13:25:22'],
    [3, 4, '2018-11-19 14:11:22'],
    [4, 3, '2019-10-01 16:09:54'],
    [5, 5, '2019-10-19 14:40:54'],
    [6, 4, '2019-10-20 16:24:22'],
]

function Comparator(a, b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
}

async function fill() {
    await deleteTables().then(() => console.log('Tables cleared'));

    for (const addr of Addresses) {
        await addAddress(addr);
    }

    for (const restaurant of Restaurants) {
        await addRestaurant(restaurant);
    }
    for (const food of Food) {
        await addFood(food);
    }

    let users = [...Customers, ...Riders, ...Staffs, ...Managers];
    users = users.sort(Comparator);
    for (const user of users) {
        let type = user[1];
        if (type === 'C') {
            await addCustomer(user);
        } else if (type === 'S') {
            await addStaff(user)
        } else if (type === 'R') {
            await addRider(user);
        } else if (type === 'M') {
            await addManager(user);
        }
    }

    for (const fullTimer of FullTimers) {
        await addFullTimer(fullTimer);
    }

    for (const partTimer of PartTimers) {
        await addPartTimer(partTimer);
    }

    for (const rate of Rates) {
        await addRate(rate)
    }

    for (const payout of Payouts) {
        await addPayout(payout)
    }

    for (const receive of Receives) {
        await addReceive(receive)
    }

    let promos = [...GlobalPromotions, ...RestaurantPromotions];
    promos = promos.sort(Comparator);
    for (const promo of promos) {
        let type = promo[1];
        if (type === 'G') {
            await addGlobalPromotion(promo);
        } else if (type === 'R') {
            await addRestaurantPromotion(promo);
        }
    }

    for (const rec of Frequents) {
        await addFrequents(rec);
    }
    for (const order of Orders) {
        await addOrders(order);
    }
    for (const collate of Collates) {
        await addCollates(collate);
    }
    for (const review of Reviews) {
        await addReview(review);
    }
    for (const rating of Ratings) {
        await addRating(rating);
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
    console.log('Tables filled')
};


// Add tables you want to increment serial keys here
async function setNextSerialKeys() {
    const tableToKey = {
        "Users": "uid",
        "FTSchedules": "scheduleid",
        "Shifts": "shiftId",
        "Payout": "payId",
        "Address": "addrId",
        "Restaurants": "rid",
        "Promotions": "pid",
        "Orders": "oid",
    }
    for (const [table, idName] of Object.entries(tableToKey)) {
        let maxId = await db.one(
            `
            SELECT max(${idName}) FROM ${table}
            `
        )
        maxId = maxId.max
        if (maxId != null) {
            console.log(`Setting next id of ${table} to ${maxId + 1}`)
            await db.oneOrNone(`SELECT setval('${table}_${idName}_seq', ${maxId}, true);`)
        }
    }
    console.log("Serial keys Set!")
}

if (require.main === module) {
    fill().then(() => setNextSerialKeys());
}

module.exports = {
    fill, setNextSerialKeys
}