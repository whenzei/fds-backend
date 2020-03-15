const db = require('./index')

SQL_STATEMENTS = {
    restaurants: `insert into Restaurants (rid, minSpending, rname) Values
        (1, 5, 'Shake Shag')
    `,
    users: `
        insert into Users (uid, name, username, salt, passwordhash) Values
        (1, 'lala bin blabla', 'lalala', 'saltysplatoon', 'brown'),
        (2, 'zhow qing tian', 'zhow', 'pepper', 'asdsad'),
        (3, 'staff of wizardry', 'Knack2Babee', 'SeaSalt', '123'),
        (4, 'the fork on the left', 'oheehee', 'Mother', 'Father')
    `,
    customers: `insert into Customers (uid) Values
    (1)`,

    riders: `insert into Riders (uid) Values
    (2)`,

    staff: `insert into Staff (uid, rid) Values
    (3, 1)`,

    managers: `insert into Managers (uid) Values
    (4)`
}

async function fill() {
    for (const [key, sqlCommand] of Object.entries(SQL_STATEMENTS)) {
        try {
            await db.none(sqlCommand);
            console.log(key + " done")
        } catch (e) {
            console.log(e);
            break;
        }
    }
};
fill().then(() => console.log("DONE"))