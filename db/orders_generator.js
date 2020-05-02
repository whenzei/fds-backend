const moment = require('moment')
const _ = require('lodash')

function generate_orders_collates_ratings_reviews(Customers, Restaurants, Addresses, Riders, Food, startDate, endDate, Promotions, deliveryFee = 300,
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
    while (currDate < endDate || currDate.isSame(endDate, 'day')) {
        let unavailRider = new Set()
        
        for (const customer of Customers) {
            // Customer: (uid, name, username, salt, passwordHash)
            
            for (let restIdx = 0; restIdx < Restaurants.length; restIdx++) {
                const rid = Restaurants[restIdx][0]
                const dailyOrdersPerCustomer = _.random(1, false)
                
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

                    // Orders: (oid, riderId, customerId, orderTime, deliveredTime, deliveryFee, isDeliveryFeeWaived, departForR, arriveAtR, departFromR, finalPrice, addrId, pid)
                    const orderTime = currDate.clone().add(_.random(11, false), 'hour')
                    let departForR = null, arriveAtR = null, departFromR = null, deliveredTime = null, rider = _.sample(Riders)[0];
                    
                    if (!lastDayIncompleteOrders || currDate.clone().add(1, 'day') < endDate) {
                        departForR = orderTime.clone().add(_.random(10, false), 'hour')
                        arriveAtR = departForR.clone().add(_.random(10, false), 'hour')
                        departFromR = arriveAtR.clone().add(_.random(10, false), 'hour')
                        deliveredTime = departFromR.clone().add(_.random(10, false), 'hour')
                    } else if (lastDayIncompleteOrders && currDate.isSame(endDate, 'day')) {
                        if (_.random(1, false) == 0) {
                            rider = null
                        } else {
                            let randInt = _.random(11, false)
                            departForR = randInt <= 10 ? orderTime.clone().add(randInt, 'minute') : null

                            randInt = _.random(11, false)
                            arriveAtR = departForR && randInt <= 10 ? departForR.clone().add(randInt, 'minute') : null

                            randInt = _.random(11, false)
                            departFromR = arriveAtR && randInt <= 10 ? arriveAtR.clone().add(randInt, 'minute') : null

                            randInt = _.random(11, false)
                            deliveredTime = departFromR && randInt <= 10 ? departFromR.clone().add(randInt, 'minute') : null

                            while (unavailRider.size != Riders.length && unavailRider.has(rider)) {
                                rider = _.sample(Riders)[0]
                            }
                            if (unavailRider.length == Riders.length) {
                                continue
                            }
                        }
                    }

                    // generate different secnarios: not assigned (a rider), awaiting pick up, delivery in progress and delivered
                    const order = [oid++, rider, customer[0], orderTime.format(timestampFormat), deliveredTime ? deliveredTime.format(timestampFormat) : null, deliveryFee, isDeliveryFeeWaived,
                    departForR ? departForR.format(timestampFormat) : null, arriveAtR ? arriveAtR.format(timestampFormat) : null, departFromR ? departFromR.format(timestampFormat) : null, totalPrice, _.sample(Addresses)[0], null]
                    Orders.push(order)
                    if (rider != null) {
                        unavailRider.add(rider)
                    }
                    
                    // Dont write rating
                    if (_.random(1, true) < ODDS_RATING || (lastDayIncompleteOrders && currDate.clone().add(1, 'day') >= endDate)) {
                        continue
                    }
                    else if (deliveredTime != null) {
                        // Ratings (oid, value, date)
                        const rating = [oid - 1, _.random(0, 5), deliveredTime.clone().add(1, 'hour').format(timestampFormat)]
                        Ratings.push(rating)
                    }

                    // Dont write Review
                    if (_.random(1, true) < ODDS_REVIEW || (lastDayIncompleteOrders && currDate.clone().add(1, 'day') >= endDate)) {
                        continue
                    } else if (deliveredTime != null) {
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
        Reviews
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

module.exports = {
    generate_orders_collates_ratings_reviews
}