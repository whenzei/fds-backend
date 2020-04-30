const moment = require('moment')
const _ = require('lodash')

function generate_orders_collates(Customers, Restaurants, Addresses, Riders, Food, startDate, endDate, dailyOrdersPerCustomer = 2, Promotions, deliveryFee = 300, isDeliveryFeeWaived = false) {
    const MAX_NUM_FOOD_ITEM_IN_ORDER = 5;
    const Orders = []
    const Collates = []
    let oid = 1
    const currDate = moment(startDate)
    endDate = moment(endDate)
    while (currDate < endDate) {

        for (const customer of Customers) {
            // Customer: (uid, name, username, salt, passwordHash)

            for (let orderIdx = 0; orderIdx < dailyOrdersPerCustomer; orderIdx++) {


                const rid = _.sample(Restaurants)[0]
                const restFood = Food.filter(food => food[0] == rid)
                const numOfDistinctFood = _.random(restFood.length)
                // Dont buy
                if (numOfDistinctFood < 1) {
                    continue;
                }

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
                const departForR = orderTime.clone().add(_.random(10, false), 'hour')
                const arriveAtR = departForR.clone().add(_.random(10, false), 'hour')
                const departFromR = arriveAtR.clone().add(_.random(10, false), 'hour')
                const deliveredTime = departFromR.clone().add(_.random(10, false), 'hour')
                const order = [oid++, _.sample(Riders)[0], customer[0], orderTime.format("YYYY-MM-DD"), deliveredTime.format("YYYY-MM-DD"), deliveryFee, isDeliveryFeeWaived,
                departForR.format("YYYY-MM-DD"), arriveAtR.format("YYYY-MM-DD"), departFromR.format("YYYY-MM-DD"), totalPrice, _.sample(Addresses)[0], null]
                Orders.push(order)
            }

        }

        currDate.add(1, 'day')

    }
    return {
        Orders,
        Collates
    }
}

module.exports = {
    generate_orders_collates
}