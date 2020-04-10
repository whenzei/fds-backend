const moment = require('moment')
function generate(FullTimers, PartTimers, startYear, startMonth, durationInMonths) {
    for (const rider of FullTimers) {
        const time = [year, month]
        for (let i = 0; i < durationInMonths; i++) {
            time[1] += 1
            if (time[1] > 12) {
                time = [time[0] + 1, 1]
            }
            let startDay = 1
            let startDate = moment(year + "-" + month + "-" + startDay)
            for (let week = 0; week < 4; week++) {
                let currDate = startDate.clone.add(week, 'week')
                for (let day = 0; day < 5; day++) {
                    currDate.add(day, 'day')
                }
            }
        }
    }
}