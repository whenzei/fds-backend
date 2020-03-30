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

async function getRiderType(uid) {
    return (await db.one(psGetRiderType, [uid])).ridertype
}
async function getFullTimeSchedule(uid, year, month) {
    let temp = await db.any(psGetFTSchedule, [uid, year, month])
    temp = temp.map(x => ({
        start: moment(x.start).tz('Asia/Singapore').format("YYYY-MM-DD HH:mm"),
        end: moment(x.end).tz('Asia/Singapore').format("YYYY-MM-DD HH:mm"),
    }))
    return temp
}

module.exports = {
    getRiderType, getFullTimeSchedule
}