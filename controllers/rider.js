const db = require('../db');
const PS = require('pg-promise').PreparedStatement
const moment = require('moment-timezone')
const RiderTypes = {
    fullTime: "Full Timer",
    partTime: "Part Timer"
}

const psGetRiderType = new PS({
    name: 'get-rider-type', text:
        `SELECT distinct case
            when exists (select 1 from FullTimers where uid = $1) then '${RiderTypes.fullTime}'
            when exists (select 1 from PartTimers where uid = $1) then '${RiderTypes.partTime}'
            else null
        end as ridertype FROM Riders`
});

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

const upsertFTSchedules = new PS({
    name: 'upsert-ft-schedules', text: `
    insert into ftschedules (uid, month, year, startdayofmonth)
    values ($1, $2, $3, $4)
        on conflict (uid, month, year)
        do update set startdayofmonth=EXCLUDED.startdayofmonth returning scheduleid
    `
})

const upsertConsists = new PS({
    name: 'upsert-consists', text: `
    insert into consists (scheduleid, relativeday, shiftid)
    values ($1, $2, $3)
        on conflict (scheduleid, relativeday)
        do update set shiftid=EXCLUDED.shiftid`
})

async function getRiderType(uid) {
    const {ridertype} = await db.one(psGetRiderType, [uid])
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

async function updateSchedule(year, month, uid, startDayOfMonth, shiftIds) {
    if (!shiftIds || shiftIds.length != 5) {
        throw new Error("5 shiftIds for 5 days should be given")
    }
    db.tx(async t => {
        const { scheduleid } = await t.one(
            upsertFTSchedules,
            [uid, month, year, startDayOfMonth])
        shiftIds.forEach(async (shiftId, relativeDay) => {
            await t.none(
                upsertConsists,
                [scheduleid, relativeDay, shiftId]
            )
        });
    })
}

module.exports = {
    getRiderType, getFullTimeSchedule, getStartDaysOfMonth, getShifts, updateSchedule, RiderTypes
}