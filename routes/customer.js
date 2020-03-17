const express = require('express')
const router = express.Router()
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql')
const customerController = require('../controllers/customer')
const restaurantController = require('../controllers/restaurant')
const orderController = require('../controllers/order')

router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

const schema = buildSchema(`
    type Restaurant {
        rid: Int!
        rname: String!
        menu: [Food!]!
        minSpending: Int!
    }

    type Food {
        fName: String!
        price: Int!
        restaurant: Restaurant!
        category: String!
    }

    type Order {
        oid: Int!
        subOrders: [SubOrder!]!
        finalPrice: Int!
    }

    type Customer {
        cname: String!
        username: String!
        addresses(last: Int = 100): [Address!]!
    }

    type SubOrder {
        food: Food!
        quantity: Int!
    }

    type Address {
        aid: Int!
        street: String!
        postalCode: String!
    }

    type RootQuery {
        me: Customer!
        allRestaurants: [Restaurant!]!
        allMyOrders: [Order!]!
    }

    type RootMutation {
        createOrder(subOrders: [Int!]!): Int!,
        addAddress(street: String!, postalCode: String!): Int!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
const graphqlMiddleware = graphqlHTTP({
    schema: schema,
    pretty: true,
    rootValue: {
        me: () => { return { cname: "req.user", username: "sadad", addresses: [] } },
        allRestaurants: async () => {
            const restaurants = await restaurantController.getAllRestaurants()
            return restaurants.map(async (r) => { return { rid: r.rid, rname: r.rid, minSpending: r.minSpending, menu: await restaurantController.getMenu(r.rid) } })
        },
        allMyOrders: async () => {
            const orders = await orderController.getOrdersById(1);
            return orders.map(async (o) => { return { oid: o.oid, finalPrice: finalPrice, subOrders: await orderController.getFoodCollation(o.oid)} })
        }
    },
    graphiql: true
})

router.use('/graphql', graphqlMiddleware);

module.exports = router;