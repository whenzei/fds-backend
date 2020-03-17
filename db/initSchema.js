const db = require('./index');

DROP_TABLES = `
        DROP TABLE IF EXISTS Users CASCADE;
        DROP TABLE IF EXISTS Managers CASCADE;
        DROP TABLE IF EXISTS Riders CASCADE;
        DROP TABLE IF EXISTS Staff CASCADE;
        DROP TABLE IF EXISTS Customers CASCADE;
        DROP TABLE IF EXISTS PartTimers CASCADE;
        DROP TABLE IF EXISTS FullTimers CASCADE;
        DROP TABLE IF EXISTS PTSchedule CASCADE;
        DROP TABLE IF EXISTS FTSchedule CASCADE;
        DROP TABLE IF EXISTS Shifts CASCADE;
        DROP TABLE IF EXISTS Consists CASCADE;
        DROP TABLE IF EXISTS Payout CASCADE;
        DROP TABLE IF EXISTS Rates CASCADE;
        DROP TABLE IF EXISTS Address CASCADE;
        DROP TABLE IF EXISTS Frequents CASCADE;
        DROP TABLE IF EXISTS Restaurants CASCADE;
        DROP TABLE IF EXISTS Promotions CASCADE;
        DROP TABLE IF EXISTS GlobalPromos CASCADE;
        DROP TABLE IF EXISTS RestaurantPromos CASCADE;
        DROP TABLE IF EXISTS Orders CASCADE;
        DROP TABLE IF EXISTS Reviews CASCADE;
        DROP TABLE IF EXISTS Ratings CASCADE;
        DROP TABLE IF EXISTS Receives CASCADE;
        DROP TABLE IF EXISTS Staff CASCADE;
        DROP TABLE IF EXISTS Food CASCADE;
        DROP TABLE IF EXISTS Collates CASCADE;
        DROP TYPE IF EXISTS MONTH_ENUM CASCADE;
        DROP TYPE IF EXISTS CUISINE_ENUM CASCADE;
    `;
SQL_STATEMENTS = {
    Enums:
        `CREATE TYPE MONTH_ENUM AS ENUM
    ('Jan', 
     'Feb',
     'Mar', 
     'Apr',
     'May',
     'Jun',
     'Jul',
     'Aug',
     'Sep',
     'Oct',
     'Nov',
     'Dec'
    );
    CREATE TYPE CUISINE_ENUM AS ENUM
    ('Western', 
     'Chinese',
     'Japanese', 
     'Indonesian',
     'Korean',
     'Indian',
     'Mediterranean',
     'Thai',
     'Vietnamese',
     'Lebanese'
    );`,
    Users:
        `CREATE TABLE Users (
        uid            SERIAL primary key,
        name            VARCHAR(100) not null,
        userName        VARCHAR(100) not null unique,
        salt            VARCHAR(100) not null,
        passwordHash    VARCHAR(100) not null
    );`,
    Managers:
        `CREATE TABLE Managers (
        uid         INTEGER references Users on delete cascade,
        primary key (uid)
    );`,
    riders:
        `CREATE TABLE Riders (
            uid     INTEGER references Users on delete cascade,
            primary key (uid)
        );`,
    PartTimers:
        `CREATE TABLE PartTimers (
            uid            INTEGER references Riders on delete cascade,
            primary key (uid)
        );
        `,
    FullTimers:
        `CREATE TABLE FullTimers (
            uid            SERIAL references Riders on delete cascade,
            primary key (uid)
        );
        `,
    PTSchedule:
        `CREATE TABLE PTSchedule (
            uid            INTEGER,
            date            DATE,
            startTime        INTEGER check (startTime >= 10 and endTime - startTime >= 1 and endTime - startTime <= 4),
            endTime         INTEGER check (endTime <= 22 and endTime - startTime >= 1 and endTime - startTime <= 4),
            primary key (uid, date, startTime, endTime),
            foreign key (uid) references PartTimers on delete cascade
        );
        `,
    FTSchedule:
        `CREATE TABLE FTSchedule (
            scheduleId        SERIAL primary key,
            uid            INTEGER not null,
            month            MONTH_ENUM not null,
            year            INTEGER not null,
            startDayOfMonth    INTEGER
            check (startDayOfMonth > 0 and startDayOfMonth < 7),
            foreign key (uid) references FullTimers on delete cascade
        );
        `,
    Shifts:
        `CREATE TABLE Shifts (
            shiftId            SERIAL primary key,
            startTime1        INTEGER check (startTime1 >= 10 and startTime1 <= 22 and startTime1 < endTime1),
            endTime1        INTEGER check (endTime1 >= 10 and endTime1 <= 22 and endTime1 < startTime2),
            startTime2        INTEGER check (startTime2 >= 10 and startTime2 <= 22 and startTime2 < endTime2),
            endTime2        INTEGER check (endTime2 >= 10 and endTime2 <= 22)
        );
        `,
    Consists:
        `CREATE TABLE Consists (
            scheduleId        INTEGER references FTSchedule on delete cascade,
            relativeDay        INTEGER check (relativeDay in (0, 1, 2, 3, 4)),
            shiftId            INTEGER references Shifts on delete cascade,
            primary key (scheduleId, shiftId)
            );
            `,
    Payout:
        `CREATE TABLE Payout (
            payId            SERIAL primary key,
            date            DATE,
            baseSalary        INTEGER check (baseSalary >= 0),
            commission        INTEGER check (commission >= 0),
            hoursClocked        INTEGER check (hoursClocked >= 0)
        );
        `,
    Rates:
        `CREATE TABLE Rates (
            month            MONTH_ENUM not null,
            year            INTEGER check (year >= 0),
            isWeekend        BOOLEAN not NULL,
            hourlyPay        INTEGER check (hourlyPay >= 0),
            primary key (month, year)
        );
        `,
    Receives:
        `CREATE TABLE Receives (
            payId            INTEGER references Payout,
            month            MONTH_ENUM,
            year            INTEGER,
            uid            INTEGER references Riders on delete set null,
            foreign key (month, year)
            references Rates (month, year) match full on delete set null,
            primary key (payId, month, year)
        );
        `,
    Customers:
        `CREATE TABLE Customers (
            uid            SERIAL,
            creditCard        CHAR(16),
            points            INTEGER,
            primary key (uid),
            foreign key(uid) references Users on delete cascade
        );
        `,
    Address:
        `CREATE TABLE Address (
            addrId          SERIAL primary key,
            unit            VARCHAR(10),
            streetName        VARCHAR(100),
            postalCode         INTEGER check (postalCode > 99999 and postalCode < 10000000)
        );
        `,
    Frequents:
        `CREATE TABLE Frequents (
            uid            SERIAL references Customers,
            addrId         INTEGER references Address,
            lastUsed       TIMESTAMP not NULL,
            primary key (uid, addrId)
        );
        `,
    Restaurants:
        `CREATE TABLE Restaurants (
            rid             INTEGER primary key,
            minSpending        INTEGER not NULL,
            rname            VARCHAR(100) not NULL
        );
        `,
    Promotions:
        `CREATE TABLE Promotions (
            pid                INTEGER primary key,
            points                INTEGER,
            startDate            DATE not NULL,
            endDate             DATE,
            percentOff             INTEGER check ((percentOff > 0 and percentOff <= 100) 
            or NULL),
            minSpending            INTEGER,
            monthsWithNoOrders     INTEGER
            /*monthsWithNoOrders is the number of months with no order to be eligible for this promo. E.g. if monthsWithNoOrders = 3 then to be eligible for this promo, customer must not have ordered in the last 3 months*/
        );
        `,
    GlobalPromos:
        `CREATE TABLE GlobalPromos (
            pid         INTEGER references Promotions on delete cascade,
            primary key (pid)
        );
        `,
    RestaurantPromos:
        `CREATE TABLE RestaurantPromos (
            pid         INTEGER references Promotions on delete cascade,
            rid        INTEGER references Restaurants not NULL,
            primary key (pid)
        );
        `,
    Orders:
        `CREATE TABLE Orders (
            oid            SERIAL primary key,
            riderId            INTEGER references Riders(uid) on delete set NULL,
            customerId        INTEGER references Customers(uid) on delete set NULL,
            orderTime        TIME not NULL,
            deliveredTime         TIME,
            deliveryFee         INTEGER not NULL,
            isDeliveryFeeWaived    BOOLEAN default FALSE,
            departForR        TIME,
            arriveAtR        TIME,
            departFromR        TIME,
            finalPrice        INTEGER not NULL,
            addrId          INTEGER not null,
            pid            INTEGER references Promotions,
            foreign key (addrId) references Address
        );
        `,
    Reviews:
        `CREATE TABLE Reviews (
            stars            INTEGER check (stars in (0, 1, 2, 3, 4, 5)),
            comment        TEXT,
            date            DATE,
            oid            SERIAL primary key references Orders
        );
        `,
    Ratings:
        `CREATE TABLE Ratings (
            value            INTEGER check (value in (0, 1, 2, 3, 4, 5)),
            date             DATE,
            oid              SERIAL primary key references Orders
        );
        `,
    Staff:
        `CREATE TABLE Staff (
            uid            SERIAL references Users on delete cascade,
            rid            SERIAL not NULL references Restaurants,    
            primary key (uid)
        );`,
    Food:
        `CREATE TABLE Food (
            fname            VARCHAR(100),
            rid            INTEGER references Restaurants,
            price            INTEGER not NULL,
            category        CUISINE_ENUM not NULL,
            dailyLimit        INTEGER not NULL,
            numOrders        INTEGER DEFAULT 0,
            primary key (rid, fname),
            check  (numOrders <= dailyLimit)
        );`,
    Collates: `CREATE TABLE Collates (
            fname            VARCHAR(100),
            rid            INTEGER,
            oid            INTEGER primary key,
            totalPrice        INTEGER check (totalPrice >= 0),
            qty            INTEGER check (qty > 0),
            foreign key (rid, fname) references Food (rid, fname),
            foreign key (oid) references Orders (oid)
        );
        `
}
async function init() {
    try {
        await db.none(DROP_TABLES);
    } catch (e) {
        console.log(e);
        return;
    }
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
init().then(() => console.log("DONE"))