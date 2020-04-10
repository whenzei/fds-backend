const moment = require('moment')
function generate(FullTimers, PartTimers, startYear, startMonth, durationInMonths, weekendhourlyPay = 1200, weekdayhourlyPay = 1000, commission = 5000) {
    //Rates
    let time = [startYear, startMonth]
    const Rates = []
    for (let i = 0; i < durationInMonths; i++) {
        time[1] += 1
        if (time[1] > 12) {
            time = [time[0] + 1, 1]
        }
        Rates.push([time[1], time[0], weekendhourlyPay, weekdayhourlyPay])
    }
    // Payout
    const Payouts = []
    let payId = 1
    for (const rider of FullTimers) {
        time = [startYear, startMonth]
        for (let i = 0; i < durationInMonths; i++) {
            time[1] += 1
            if (time[1] > 12) {
                time = [time[0] + 1, 1]
            }
            let baseSalary = 0
            let startDay = Math.floor(Math.random() * 3) + 1; 
            let hoursClocked = 0
            let startDate = moment(time[0] + "-" + (time[1] < 10 ? "0" + time[1] : time[1]) + "-0" + startDay)
            let currDate;
            for (let week = 0; week < 4; week++) {
                currDate = startDate.clone().add(week, 'week')
                for (let day = 0; day < 5; day++) {
                    if (currDate.format('ddd') in ['Sat', 'Sun']) {
                        baseSalary += 8 * weekendhourlyPay
                    } else {
                        baseSalary += 8 * weekdayhourlyPay
                    }
                    hoursClocked += 8
                    currDate.add(1, 'day')
                }
            }
            currDate.add(-1, 'day')
            Payouts.push([payId++, startDate.format("YYYY-MM-DD"), currDate.format("YYYY-MM-DD"), currDate.add(1, 'day').format("YYYY-MM-DD"), baseSalary, commission, hoursClocked])
        }
    }
    return [Rates, Payouts]
}

let a = generate([5, 6], [7, 8], 2029, 11, 5)