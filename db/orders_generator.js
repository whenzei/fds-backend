const moment = require('moment')
const _ = require('lodash')

function generate_orders_collates_ratings_reviews(Customers, Restaurants, Addresses, Riders, Food, startDate, endDate, deliveryFee = 300,
    isDeliveryFeeWaived = false, lastDayIncompleteOrders = true) {
    const ODDS_RATING = 0.5;
    const ODDS_REVIEW = 0.5;
    const MAX_NUM_FOOD_ITEM_IN_ORDER = 5;
    const Orders = []
    const Collates = []
    const Ratings = []
    const Reviews = []
    let oid = 1
    const currDate = moment(startDate + " 10")
    endDate = moment(endDate)
    const timestampFormat = "YYYY-MM-DD HH:mm"

    const { RestaurantPromos, GlobalPromos } = generate_promos(currDate.clone(), endDate.clone(), Restaurants)

    const lastOrderDates = Customers.reduce(function (map, c) {
        map[c[0]] = moment('1990-01-01')
        return map
    }, {})
    while (currDate < endDate || currDate.isSame(endDate, 'day')) {
        let unavailRider = new Set()

        for (const customer of Customers) {
            // Customer: (uid, name, username, salt, passwordHash)
            const uid = customer[0]

            for (let restIdx = 0; restIdx < Restaurants.length; restIdx++) {
                const rid = Restaurants[restIdx][0]
                const dailyOrdersPerCustomer = _.random(1)

                for (let orderIdx = 0; orderIdx < dailyOrdersPerCustomer; orderIdx++) {
                    const restFood = Food.filter(food => food[0] == rid)
                    const numOfDistinctFood = _.random(1, restFood.length)

                    let totalPrice = 0
                    for (const food of _.sampleSize(restFood, numOfDistinctFood)) {
                        const qty = _.random(1, MAX_NUM_FOOD_ITEM_IN_ORDER)
                        // Collates: (fname, rid, oid, totalPrice, qty)
                        // Food: (rid, fname, category, price, dailyLimit)
                        const price = food[3] * qty
                        totalPrice += price
                        const collate = [food[1], rid, oid, price, qty]
                        Collates.push(collate)
                    }

                    // Check eligible promos
                    const { eligibleGlobPromos, eligibleRestPromos } = eligiblePromos(rid, currDate, totalPrice, lastOrderDates[uid], RestaurantPromos, GlobalPromos)
                    let pid = null
                    if (eligibleGlobPromos.length > 0) {
                        // GlobalPromos (pid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders)

                        const promo = _.sample(eligibleGlobPromos)
                        totalPrice = Math.round((100 - promo[4]) / 100 * totalPrice)
                        pid = promo[0]
                        lastOrderDates[uid] = currDate.clone()
                    } else if (eligibleRestPromos.length > 0) {
                        // RestaurantPromos (pid, rid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders)
                        const promo = _.sample(eligibleRestPromos)
                        totalPrice = Math.round((100 - promo[5]) / 100 * totalPrice)
                        pid = promo[0]
                        lastOrderDates[uid] = currDate.clone()
                    }

                    // Orders: (oid, riderId, customerId, orderTime, deliveredTime, deliveryFee, isDeliveryFeeWaived, departForR, arriveAtR, departFromR, finalPrice, addrId, pid, iscod)
                    const orderTime = currDate.clone().add(_.random(11), 'hour')
                    let departForR = null, arriveAtR = null, departFromR = null, deliveredTime = null, rider = _.sample(Riders)[0];

                    if (currDate.isBefore(endDate) || !lastDayIncompleteOrders) {
                        departForR = orderTime.clone().add(_.random(10), 'minute')
                        arriveAtR = departForR.clone().add(_.random(10), 'minute')
                        departFromR = arriveAtR.clone().add(_.random(10), 'minute')
                        deliveredTime = departFromR.clone().add(_.random(10), 'minute')
                    } else {
                        if (_.random(1) == 0) {
                            rider = null
                        } else {
                            // Depart For R will not be null if rider has selected order
                            let randInt = _.random(1, 10)
                            departForR = orderTime.clone().add(randInt, 'minute')

                            randInt = _.random(11)
                            arriveAtR = departForR && randInt <= 10 ? departForR.clone().add(randInt, 'minute') : null

                            randInt = _.random(11)
                            departFromR = arriveAtR && randInt <= 10 ? arriveAtR.clone().add(randInt, 'minute') : null

                            randInt = _.random(11)
                            deliveredTime = departFromR && randInt <= 10 ? departFromR.clone().add(randInt, 'minute') : null

                            while (unavailRider.size != Riders.length && unavailRider.has(rider)) {
                                rider = _.sample(Riders)[0]
                            }
                            if (unavailRider.length == Riders.length) {
                                continue
                            }
                        }
                    }
                    const isCod = _.random(1) > 0
                    // generate different secnarios: not assigned (a rider), awaiting pick up, delivery in progress and delivered
                    const order = [oid++, rider, customer[0], orderTime.format(timestampFormat), deliveredTime ? deliveredTime.format(timestampFormat) : null, deliveryFee, isDeliveryFeeWaived,
                    departForR ? departForR.format(timestampFormat) : null, arriveAtR ? arriveAtR.format(timestampFormat) : null, departFromR ? departFromR.format(timestampFormat) : null,
                        totalPrice, _.sample(Addresses)[0], pid, isCod]
                    Orders.push(order)
                    if (rider != null) {
                        unavailRider.add(rider)
                    }

                    // Rate delivered order (not on end date)
                    if (_.random(1, true) > ODDS_RATING && deliveredTime != null && !deliveredTime.isSame(endDate, 'day')) {
                        // Ratings (oid, value, date)
                        const rating = [oid - 1, _.random(0, 5), deliveredTime.clone().add(1, 'hour').format(timestampFormat)]
                        Ratings.push(rating)
                    }

                    // Review delivered food (not on end date)
                    if (_.random(1, true) > ODDS_REVIEW && deliveredTime != null && !deliveredTime.isSame(endDate, 'day')) {
                        // Reviews (oid, comment, stars, date)
                        const review = [oid - 1, random_comment(), _.random(0, 5), deliveredTime.clone().add(2, 'hour').format(timestampFormat)]
                        Reviews.push(review)
                    }
                }
            }

        }

        currDate.add(1, 'day')

    }
    return {
        Orders,
        Collates,
        Ratings,
        Reviews,
        RestaurantPromos,
        GlobalPromos
    }
}

function generate_promos(startDate, endDate, Restaurants) {
    const ODDS_MONTHLY_REST_PROMO = 1;
    const ODDS_MONTHLY_GLOBAL_PROMO = 0.5;
    // RestaurantPromos (pid, rid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders)
    const RestaurantPromos = []
    // GlobalPromos (pid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders)
    const GlobalPromos = []

    let pid = 1
    const monthIntervals = []
    const currDate = startDate.clone()
    const dateFormat = 'YYYY-MM-DD'
    while (currDate.isBefore(endDate)) {
        monthIntervals.push({ start: currDate.startOf('month').format(dateFormat), end: currDate.endOf('month').format(dateFormat) })
        currDate.add(1, 'month')
    }


    // Gen global promo
    for (const monthInterval of monthIntervals) {
        // No promo
        if (_.random(1, true) > ODDS_MONTHLY_GLOBAL_PROMO) {
            continue
        }
        const points = _.random(100)
        const percentOff = _.random(100)
        const minSpending = _.random(100)
        const monthsWithNoOrders = _.random(12)
        const promo = [pid++, points, monthInterval.start, monthInterval.end, percentOff, minSpending, monthsWithNoOrders]
        GlobalPromos.push(promo)
    }

    // Gen rest promo
    for (const monthInterval of monthIntervals) {
        for (const rest of Restaurants) {
            // No promo
            if (_.random(1, true) > ODDS_MONTHLY_REST_PROMO) {
                continue
            }
            const points = _.random(100)
            const percentOff = _.random(100)
            const minSpending = 0
            const monthsWithNoOrders = 0
            const promo = [pid++, rest[0], points, monthInterval.start, monthInterval.end, percentOff, minSpending, monthsWithNoOrders]
            RestaurantPromos.push(promo)
        }
    }


    return {
        GlobalPromos, RestaurantPromos
    }
}

// Add more comments here
function random_comment() {
    return _.sample(
        [
            'Food is decent, would buy again',
            'Wished that the Chow Mein is spicier, otherwise all is good!',
            'Food is below average',
            'One of the best places for Chicken Chop',
            '',
            'Average food',
            'Pretty good for the price'
        ]
    )
}

function eligiblePromos(rid, orderTime, totalPrice, lastOrderDate, RestaurantPromos, GlobalPromos) {
    const eligibleRestPromos = []
    const eligibleGlobPromos = []

    // GlobalPromos (pid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders)
    for (const promo of GlobalPromos) {
        const startDate = moment(promo[2])
        const endDate = moment(promo[3])
        if (orderTime.isAfter(startDate) && orderTime.isBefore(endDate)
            && totalPrice >= promo[5]
            && lastOrderDate.clone().add(promo[6], 'month').isBefore(orderTime)) {
            eligibleGlobPromos.push(promo)
        }
    }

    // RestaurantPromos (pid, rid, points, startDate, endDate, percentOff, minSpending, monthsWithNoOrders)

    for (const promo of RestaurantPromos) {
        const startDate = moment(promo[3])
        const endDate = moment(promo[4])
        // if (!lastOrderDate.clone().add(promo[7], 'month').isBefore(orderTime)) {
        //     console.log(lastOrderDate.format("YYYY-MM-DD"), orderTime.format("YYYY-MM-DD"))
        //     break
        // }
        if (rid == promo[1]
            && orderTime.isAfter(startDate) && orderTime.isBefore(endDate)
            && totalPrice >= promo[6]
            && lastOrderDate.clone().add(promo[7], 'month').isBefore(orderTime)
            ) {
            eligibleRestPromos.push(promo)
        }
    }
    return {
        eligibleGlobPromos,
        eligibleRestPromos
    }
}

module.exports = {
    generate_orders_collates_ratings_reviews
}