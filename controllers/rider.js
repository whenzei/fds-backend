const db = require('../db');
const PS = require('pg-promise').PreparedStatement
const moment = require('moment-timezone')
const turf = require('@turf/turf')
const RiderTypes = {
    fullTime: "Full Timer",
    partTime: "Part Timer"
}
const axios = require('axios')

const psGetRiderType = new PS({
    name: 'get-rider-type', text:
        `SELECT distinct case
            when exists (select 1 from FullTimers where uid = $1) then '${RiderTypes.fullTime}'
            when exists (select 1 from PartTimers where uid = $1) then '${RiderTypes.partTime}'
            else null
        end as ridertype FROM Riders`
});

const psSelectOrder = new PS({
    name: 'select-order', text: `
    UPDATE orders
    set riderid = $1, departforr = now()
    where riderid IS NULL and oid = $2
    `
})


const psGetAvailableOrders = new PS({
    name: 'get-available-orders', text: `
    Select distinct O.oid, R.rname, A1.streetname as rstreetname, A1.postalcode as rpostalcode,
        A2.streetname as cstreetname, A2.postalcode as cpostalcode, O.finalprice + O.deliveryfee as totalprice
    from Orders O natural join Collates C join Restaurants R on C.rid = R.rid join Address A1 on R.addrid = A1.addrid join Address A2 on O.addrid = A2.addrid
    where riderid IS NULL;
    `
});

const psGetCurrentOrder = new PS({
    name: 'get-current-order', text: `
    Select distinct O.oid, R.rname, A1.streetname as rstreetname, A1.postalcode as rpostalcode,
        A2.streetname as cstreetname, A2.postalcode as cpostalcode, O.finalprice + O.deliveryfee as totalprice
    from Orders O natural join Collates C join Restaurants R on C.rid = R.rid join Address A1 on R.addrid = A1.addrid join Address A2 on O.addrid = A2.addrid
    where deliveredtime IS NULL
    `
});

const getOrderedFood = new PS({
    name: 'get-ordered-food', text: `
    Select fname, qty
    from Collates
    where oid = $1
    `
})

const psGetFTSchedule = new PS({
    name: 'get-ft-schedule', text:
        `
        with FirstWeek as (
            select 
                make_timestamp(year, 
                month,
                 startDayOfMonth + relativeDay,
                  startTime1, 0, 0)
            as startTimeStamp,
                make_timestamp(year,
                    month,
                    startDayOfMonth + relativeDay,
                 endTime1, 0, 0)
            as endTimeStamp
            from Consists natural join Shifts natural join FTSchedules
            where uid = $1 and year = $2 and month = $3
            union
            select 
                make_timestamp(year, 
                    month,
                    startDayOfMonth + relativeDay,
                  startTime2, 0, 0)
            as startTimeStamp,
                make_timestamp(year, 
                    month,
                    startDayOfMonth + relativeDay,
                 endTime2, 0, 0)
            as endTimeStamp
            from Consists natural join Shifts natural join FTSchedules
            where uid = $1 and year = $2 and month = $3
            )
            select startTimeStamp + make_interval(weeks := week) as start, endTimeStamp + make_interval(weeks := week) as end
            FROM FirstWeek, unnest(ARRAY[0,1,2,3]) as week;
        `
})

const psGetPTSchedule = new PS({
    name: 'get-pt-schedule', text:
        `
        select P.date + make_interval(hours := P.starttime) as start, P.date + make_interval(hours := P.endtime) as end
        from ptschedules P
        where uid = $1 and extract(year from P.date) = $2 and extract(month from P.date) = $3
        `
})


const psUpsertFTSchedule = new PS({
    name: 'upsert-ft-schedules', text: `
    insert into ftschedules (uid, month, year, startdayofmonth)
    values ($1, $2, $3, $4)
        on conflict (uid, month, year)
        do update set startdayofmonth=EXCLUDED.startdayofmonth returning scheduleid
    `
})

const psDeleteWeeklySchedules = new PS({
    name: 'delete-weekly-pt-schedules', text: `
    delete from
        ptschedules P
    where
        uid = $1
        and P.date in (
            select
                to_date($2 :: TEXT || $3 :: TEXT, 'iyyyiw') + make_interval(days := day)
            from
                unnest(ARRAY [0,1,2,3,4,5,6]) as day
        )
    `
})

const psInsertPTSchedule = new PS({
    name: 'insert-pt-schedule', text: `
    insert into ptschedules (uid, date, startTime, endTime)
    values ($1, to_date($2 || $3, 'iyyyiw') + make_interval(days := $4), $5, $6);
    `
})

const psUpsertConsists = new PS({
    name: 'upsert-consists', text: `
    insert into consists (scheduleid, relativeday, shiftid)
    values ($1, $2, $3)
        on conflict (scheduleid, relativeday)
        do update set shiftid=EXCLUDED.shiftid`
})

async function getRiderType(uid) {
    const { ridertype } = await db.one(psGetRiderType, [uid])
    return ridertype
}
async function getFullTimeSchedule(uid, year, month) {
    let temp = await db.any(psGetFTSchedule, [uid, year, month])
    temp = temp.map(x => ({
        start: moment(x.start).tz('Asia/Singapore').format("YYYY-MM-DD HH:mm"),
        end: moment(x.end).tz('Asia/Singapore').format("YYYY-MM-DD HH:mm"),
    }))
    return temp
}

async function getPartTimeSchedule(uid, year, month) {
    let temp = await db.any(psGetPTSchedule, [uid, year, month])
    temp = temp.map(x => ({
        start: moment(x.start).tz('Asia/Singapore').format("YYYY-MM-DD HH:mm"),
        end: moment(x.end).tz('Asia/Singapore').format("YYYY-MM-DD HH:mm"),
    }))
    return temp
}

function getStartDaysOfMonth(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate()
    const spanOfWorkingDays = 7 * 3 + 5;
    const startDays = []
    for (let i = 0; i <= daysInMonth - spanOfWorkingDays; i++) {
        startDays.push(i + 1);
    }
    return startDays;
}

async function getShifts() {
    return await db.any('SELECT * FROM Shifts')
}

async function updateFTSchedule(year, month, uid, startDayOfMonth, shiftIds) {
    if (!shiftIds || shiftIds.length != 5) {
        throw new Error("5 shiftIds for 5 days should be given")
    }
    db.tx(async t => {
        const { scheduleid } = await t.one(
            psUpsertFTSchedule,
            [uid, month, year, startDayOfMonth])
        shiftIds.forEach(async (shiftId, relativeDay) => {
            await t.none(
                psUpsertConsists,
                [scheduleid, relativeDay, shiftId]
            )
        });
    })
}

async function updatePTSchedule(uid, year, week, dailyschedules) {
    db.tx(async t => {
        await db.none(psDeleteWeeklySchedules, [uid, year, week])
        dailyschedules.forEach(async (dailyschedule, day) => {
            dailyschedule.slots.forEach((async slot => {
                await t.none(
                    psInsertPTSchedule,
                    [uid, year, week, day, slot.startTime, slot.endTime]
                )
            }))
        });
    })
}

async function getAvailableOrders(lng, lat) {
    const res = await db.any(psGetAvailableOrders)
    return Promise.all(res.map(async item => {
        const rLoc = await getLocation(item.rpostalcode)
        const cLoc = await getLocation(item.cpostalcode)
        const rDist = getDistance(lng, lat, rLoc.LONGITUDE, rLoc.LATITUDE)
        const cDist = getDistance(lng, lat, cLoc.LONGITUDE, cLoc.LATITUDE)
        return {
            oid: item.oid,
            Restaurant: item.rname,
            "Restaurant Address": item.rstreetname,
            rPostalCode: item.rpostalcode,
            "Distance To Restaurant": rDist,
            "Customer Address": item.cstreetname,
            cPostalcode: item.cpostalcode,
            "Distance to Customer": cDist,
            "Total Price": item.totalprice,
            "Payment Method": "Credit Card"
        }
    })
    )
}

async function getCurrentOrder(uid, lng, lat) {
    let order;
    let orders = await db.any(psGetCurrentOrder);
    if (orders.length < 1) return {}
    order = orders[0]
    const food = await db.any(getOrderedFood, [order.oid])
    const rLoc = await getLocation(order.rpostalcode)
    const cLoc = await getLocation(order.cpostalcode)
    const rDist = getDistance(lng, lat, rLoc.LONGITUDE, rLoc.LATITUDE)
    const cDist = getDistance(lng, lat, cLoc.LONGITUDE, cLoc.LATITUDE)
    return {
        oid: order.oid,
        Restaurant: order.rname,
        "Restaurant Address": order.rstreetname,
        rPostalCode: order.rpostalcode,
        "Distance To Restaurant": rDist,
        "Customer Address": order.cstreetname,
        cPostalcode: order.cpostalcode,
        "Distance to Customer": cDist,
        "Total Price": order.totalprice,
        "Payment Method": "Credit Card",
        food,
    }
}

async function getLocation(postalCode) {
    let resp;
    try {
        resp = await axios.get(`https://developers.onemap.sg/commonapi/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=N`)
    } catch (e) {
        console.log(e)
        // In case API fails
        return {
            LONGITUDE: Math.random() * (1.4290000 - 1.29) + 1.29,
            LATITUDE: Math.random() * (463.971569 - 463.662377) + 463.662377,
        }
    }
    return resp.data.results[0]
}

function getDistance(lng1, lat1, lng2, lat2) {
    const from = turf.point([lng1, lat1]);
    const to = turf.point([lng2, lat2]);
    const options = { units: 'meters' };
    const distance = turf.distance(from, to, options);
    return distance
}

async function selectOrder(uid, oid) {
    let count;
    try {
        count = await db.tx(async t => {
            const currOrder = await db.any(psGetCurrentOrder)
            if (currOrder.length > 0) {
                return 0
            }
            const count = await db.result(psSelectOrder, [uid, oid], r => r.rowCount)
            return count
        })
    } catch (e) {
        throw e;
    }
    if (count < 1) {
        throw "Failed to select order"
    }
    return
}

module.exports = {
    getRiderType, getFullTimeSchedule, getStartDaysOfMonth, getShifts, updateFTSchedule, updatePTSchedule, RiderTypes, getPartTimeSchedule, getAvailableOrders, getCurrentOrder, selectOrder
}