const moment = require('moment')
function generate_payouts_receives_rates(FullTimers, PartTimers, startYear, startMonth, durationInMonths, weekendhourlyPay = 1200, weekdayhourlyPay = 1000, commission = 5000) {
    const Rates = []
    const Payouts = []
    const Receives = []

    //Rates
    let time = [startYear, startMonth]
    for (let i = 0; i <= durationInMonths; i++) {
        if (time[1] > 12) {
            time = [time[0] + 1, 1]
        }
        Rates.push([time[1], time[0], weekendhourlyPay, weekdayhourlyPay])
        time[1] += 1
    }
    // FT Payout and Receives
    let payId = 1
    for (let rider of FullTimers) {
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
            Receives.push([payId, time[1], time[0], rider[0]])
            Payouts.push([payId++, startDate.format("YYYY-MM-DD"), currDate.format("YYYY-MM-DD"), currDate.add(1, 'day').format("YYYY-MM-DD"), baseSalary, commission, hoursClocked])
        }
    }
    // PT Payout
    for (let rider of PartTimers) {
        let year = startYear
        let startWeek = startMonth * 4
        let curr = moment(year + "-W" + (startWeek < 10 ? "0" + startWeek : startWeek) + "-" + 1);
        let end = curr.clone().add(durationInMonths, 'month');
        while (curr.isBefore(end)) {
            const hoursClocked = Math.floor(Math.random() * 39) + 10
            const baseSalary = Math.floor(hoursClocked * (5 / 7 * weekdayhourlyPay + 2 / 7 * weekendhourlyPay))
            Receives.push([payId, curr.month() + 1, curr.year(), rider[0]])
            Payouts.push([payId++, curr.format("YYYY-MM-DD"), curr.clone().add(6, 'day').format("YYYY-MM-DD"), curr.add(1, 'week').format("YYYY-MM-DD"), baseSalary, commission, hoursClocked])
        }
    }
    return [Rates, Payouts, Receives]
}

module.exports = {
    generate_payouts_receives_rates
}