const db = require('./index');

DROP_TABLES = `
        DROP TABLE IF EXISTS Users CASCADE;
        DROP TABLE IF EXISTS Managers CASCADE;
        DROP TABLE IF EXISTS Riders CASCADE;
        DROP TABLE IF EXISTS Staff CASCADE;
        DROP TABLE IF EXISTS Customers CASCADE;
        DROP TABLE IF EXISTS PartTimers CASCADE;
        DROP TABLE IF EXISTS FullTimers CASCADE;
        DROP TABLE IF EXISTS PTSchedules CASCADE;
        DROP TABLE IF EXISTS FTSchedules CASCADE;
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

TRIGGERS = {
        user_subclass_overlap_check: 
        `CREATE OR REPLACE FUNCTION check_subuser_constraint() RETURNS TRIGGER AS $$
        DECLARE 
        user 		INTEGER;
        BEGIN
        SELECT
            uid INTO user
        FROM
            Users U
        WHERE
            U.uid = NEW.uid
            AND (
                U.uid in (SELECT uid FROM Riders) OR
                U.uid in (SELECT uid FROM Customers) OR
                U.uid in (SELECT uid FROM Staff) OR
                U.uid in (SELECT uid FROM Managers)
            );
        IF FOUND THEN RAISE exception '% user already exists in a Users subclass', NEW.uid;
        END IF;
        RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        
        DROP TRIGGER IF EXISTS customer_trigger ON Customers CASCADE;
        CREATE TRIGGER customer_trigger
        BEFORE INSERT ON Customers
        FOR EACH ROW
        EXECUTE FUNCTION check_subuser_constraint();

        DROP TRIGGER IF EXISTS rider_trigger ON Riders CASCADE;
        CREATE TRIGGER rider_trigger
        BEFORE INSERT OR UPDATE ON Riders
        FOR EACH ROW
        EXECUTE FUNCTION check_subuser_constraint();

        DROP TRIGGER IF EXISTS manager_trigger ON Managers CASCADE;
        CREATE TRIGGER manager_trigger
        BEFORE INSERT OR UPDATE ON Managers
        FOR EACH ROW
        EXECUTE FUNCTION check_subuser_constraint();

        DROP TRIGGER IF EXISTS staff_trigger ON Staff CASCADE;
        CREATE TRIGGER staff_trigger
        BEFORE INSERT OR UPDATE ON Staff
        FOR EACH ROW
        EXECUTE FUNCTION check_subuser_constraint();
        `,
    riders_subclass_overlap_check: 
        `
        CREATE OR REPLACE FUNCTION check_subrider_constraint() RETURNS TRIGGER AS $$
        DECLARE
        rider 		INTEGER;
        BEGIN
        SELECT
            uid INTO rider
        FROM
            Riders R
        WHERE
            R.uid = NEW.uid
            AND (
                R.uid in (SELECT uid FROM PartTimers) OR
                R.uid in (SELECT uid FROM FullTimers)
            );
        IF FOUND THEN RAISE exception '% rider already exists in a Riders subclass', NEW.uid;

        END IF;
        RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS full_timer_trigger ON FullTimers CASCADE;
        CREATE TRIGGER full_timer_trigger
        BEFORE INSERT OR UPDATE ON FullTimers
        FOR EACH ROW
        EXECUTE FUNCTION check_subrider_constraint();

        DROP TRIGGER IF EXISTS part_timer_trigger ON PartTimers CASCADE;
        CREATE TRIGGER part_timer_trigger
        BEFORE INSERT OR UPDATE ON PartTimers
        FOR EACH ROW
        EXECUTE FUNCTION check_subrider_constraint();
        `,
    promo_subclass_check:
        `
        CREATE OR REPLACE FUNCTION check_promotions_constraint() RETURNS TRIGGER AS $$
        DECLARE
        promotion 	INTEGER;
        BEGIN
        SELECT
            pid INTO promotion
        FROM
            Promotions P
        WHERE
            P.pid = NEW.pid
            AND (
                P.pid in (SELECT pid FROM GlobalPromos) OR
                P.pid in (SELECT pid FROM RestaurantPromos)
            );
        IF FOUND THEN RAISE exception '% promotion already exists in a Promotions subclass', NEW.pid;
        END IF;
        RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;


        DROP TRIGGER IF EXISTS gobal_promo_trigger ON GlobalPromos CASCADE;
        CREATE TRIGGER global_promo_trigger
        BEFORE INSERT OR UPDATE ON GlobalPromos
        FOR EACH ROW
        EXECUTE FUNCTION check_promotions_constraint();

        DROP TRIGGER IF EXISTS restaurant_promo_trigger ON RestaurantPromos CASCADE;
        CREATE TRIGGER restaurant_promo_trigger
        BEFORE INSERT OR UPDATE ON RestaurantPromos
        FOR EACH ROW
        EXECUTE FUNCTION check_promotions_constraint();
        `,
    pt_schedule_break_check:
        `
        CREATE OR REPLACE FUNCTION check_pt_schedule() RETURNS TRIGGER AS $$
        DECLARE
        numViolates	INTEGER;
        BEGIN
        WITH SortPT AS (
            SELECT P1.uid, P1.date, P2.startTime - P1.endTime as break
            FROM PTSchedules P1, PTSchedules P2
            WHERE P1.uid = P2.uid AND P1.date = P2.date AND P1.startTime < P2.startTime
        )
        /*check breaks for each day, returns 1 if any of the days have a break that is < 1 hour*/
        SELECT count(*) INTO numViolates
        FROM SortPT
        WHERE NEW.uid = uid AND NEW.date = date AND break < 1;
        
        IF numViolates IS NOT NULL AND numViolates > 0 THEN
            RAISE EXCEPTION 'There must be at least one hour break between two consecutive hour intervals. There were % such violations for date %', numViolates, NEW.date;
        END IF;

        RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS check_pt_schedule_trigger ON PTSchedules;
        CREATE CONSTRAINT TRIGGER check_pt_schedule_trigger
        AFTER INSERT OR UPDATE
        ON PTSchedules
        DEFERRABLE INITIALLY DEFERRED
        FOR EACH ROW
        EXECUTE FUNCTION check_pt_schedule();
        `,
    pt_schedule_total_hours_check:
        `
        CREATE OR REPLACE FUNCTION check_pt_total_hours () RETURNS TRIGGER AS $$
        DECLARE
        totalHours	INTEGER;

        BEGIN
        /*check if total number of hours in each WWS is at least 10 and at most 48*/
        SELECT sum(endTime - startTime) INTO totalHours
            FROM PTSchedules
            WHERE NEW.uid = uid AND date_part('year', date::date) = date_part('year', NEW.date::date) AND date_part('week', date::date) = date_part('week', NEW.date::date);
        
            IF totalHours < 10 OR  totalHours > 48 THEN
                RAISE EXCEPTION 'Total number of hours for each part time rider must be at least 10 and at most 48 hours.';
            END IF;
        RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS check_pt_total_hours_trigger ON PTSchedules;
        CREATE CONSTRAINT TRIGGER check_pt_total_hours_trigger
        AFTER INSERT OR UPDATE OR DELETE
        ON PTSchedules
        DEFERRABLE INITIALLY DEFERRED
        FOR EACH ROW
        EXECUTE FUNCTION check_pt_total_hours ();
        `,
    collates_check:
        `
        CREATE OR REPLACE FUNCTION is_order_from_same_restaurant() RETURNS 
        TRIGGER AS $$
        DECLARE 

        uniqueRid INTEGER;

        BEGIN
        /* counts the unique restaurant ids for an order id */

        SELECT count(distinct rid) INTO uniqueRid
        FROM Collates C
        GROUP BY C.oid
        HAVING C.oid = NEW.oid;

        IF uniqueRid <> 1 THEN
        RAISE EXCEPTION 'Please make sure the item you have selected belongs to the same restaurant as other items in your order.' ;
        END IF;
        RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS unique_restaurant_order_trigger ON Collates;
        CREATE TRIGGER unique_restaurant_order_trigger
        AFTER UPDATE OR INSERT 
        ON Collates
        FOR EACH ROW
        EXECUTE FUNCTION  is_order_from_same_restaurant();
        `,
    frequents_check:
        `
        CREATE OR REPLACE FUNCTION is_address_count_in_limit() RETURNS 
        TRIGGER AS $$
        DECLARE 

        addressCt INTEGER;

        BEGIN
        /* counts the number of addresses for each customer*/

        SELECT count(*) INTO addressCt
        FROM Frequents
        WHERE NEW.uid = uid;

        IF addressCt >= 5 THEN
            DELETE FROM Frequents WHERE uid = NEW.uid AND lastUsed = (SELECT min(lastUsed) FROM Frequents WHERE NEW.uid = uid);
            RETURN NEW;
        END IF;
        RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS limit_customer_address_count_trigger ON Frequents;
        CREATE TRIGGER limit_customer_address_count_trigger
        BEFORE INSERT 
        ON Frequents
        FOR EACH ROW
        EXECUTE FUNCTION  is_address_count_in_limit();
        `,
        // rider_schedule_check:
};

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
    PTSchedules:
        `CREATE TABLE PTSchedules (
            uid            INTEGER,
            date            DATE,
            startTime        INTEGER check (startTime >= 10 and endTime - startTime >= 1 and endTime - startTime <= 4),
            endTime         INTEGER check (endTime <= 22 and endTime - startTime >= 1 and endTime - startTime <= 4),
            primary key (uid, date, startTime, endTime),
            foreign key (uid) references PartTimers on delete cascade
        );
        `,
    FTSchedules:
        `CREATE TABLE FTSchedules (
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
            scheduleId        INTEGER references FTSchedules on delete cascade,
            relativeDay        INTEGER check (relativeDay in (0, 1, 2, 3, 4)),
            shiftId            INTEGER references Shifts on delete cascade,
            primary key (scheduleId, shiftId, relativeDay)
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
            points            INTEGER DEFAULT 0,
            primary key (uid),
            foreign key(uid) references Users on delete cascade
        );
        `,
    Address:
        `CREATE TABLE Address (
            addrId          SERIAL primary key,
            unit            VARCHAR(10) not NULL,
            streetName        VARCHAR(100) not NULL,
            postalCode         INTEGER check (postalCode > 99999 and postalCode < 10000000) not NULL,
            unique(unit, streetName, postalCode)
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
            orderTime        TIMESTAMP not NULL,
            deliveredTime         TIMESTAMP,
            deliveryFee         INTEGER not NULL,
            isDeliveryFeeWaived    BOOLEAN default FALSE,
            departForR        TIMESTAMP,
            arriveAtR        TIMESTAMP,
            departFromR        TIMESTAMP,
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
            oid            INTEGER,
            totalPrice        INTEGER check (totalPrice >= 0),
            qty            INTEGER check (qty > 0),
            primary key (oid, fname),
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
    for (const [key, trigger] of Object.entries(TRIGGERS)) {
        try {
            await db.none(trigger);
            console.log(key + " done")
        } catch (e) {
            console.log(e);
            break;
        }
    }
};
init().then(() => console.log("DONE"))