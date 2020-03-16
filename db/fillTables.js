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

const Restaurants = [
    [1, 5, 'Fukuroku'],
    [2, 10, 'MaMas Specials']
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
};

fill().then(() => console.log('Tables filled'));
