const express = require('express')
const router = express.Router()
const { ApolloServer, gql, ApolloError } = require('apollo-server-express');
const customerController = require('../controllers/customer')
const restaurantController = require('../controllers/restaurant')
const orderController = require('../controllers/order')
const addressController = require('../controllers/address')

const typeDefs = gql`
    type Restaurant {
        rid: Int!
        rname: String!
        menu: [Food!]!
        minSpending: Int
    }

    type Food {
        fname: String!
        price: Int!
        category: String!
    }

    type Order {
        oid: Int!
        subOrders: [SubOrder!]!
        finalPrice: Int!
    }

    type Customer {
        uid: Int!
        cname: String!
        username: String!
        addresses(last: Int = 100): [Address!]!
    }

    type SubOrder {
        food: Food!
        quantity: Int!
    }

    type Address {
        addrId: Int!
        street: String!
        postalCode: String!
    }

    type Query {
        me: Customer!
        allRestaurants: [Restaurant!]!
        allMyOrders: [Order!]!
    }

    type Mutation {
        createOrder(subOrders: [Int!]!): Int!,
        addAddress(street: String!, postalCode: String!): Int!
    }
`;

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            context.user = { uid: 1, name: "zhow qing tian", username: "zhow" }
            return { uid: context.user.uid, cname: context.user.name, username: context.user.username }
        },
        allRestaurants: async () => {
            let restaurants = []
            try {
                restaurants = await restaurantController.getAllRestaurants()
            } catch (err) {
                throw new ApolloError(err)
            }
            return restaurants.map((r) => { return { rid: r.rid, rname: r.rname, minSpending: r.minSpending } })
        },
        allMyOrders: async () => {
            let orders = []
            try {
                orders = await orderController.getOrdersByUid()
            } catch (err) {
                throw new ApolloError(err)
            }
            return orders.map((o) => { return { oid: o.oid, finalPrice: o.finalPrice } })
        }
    },
    Customer: {
        addresses: async (customer) => {
            let addresses;
            try {
                addresses = await addressController.getAddressesByUid(customer.uid)
            } catch (err) {
                throw new ApolloError(err)
            }
            return addresses.map((a => { return { addrId: a.addrId, street: a.streetname, postalCode: a.postalcode } }))
        }
    },
    Restaurant: {
        menu: async (restaurant) => {
            let menu = []
            try {
                menu = await restaurantController.getMenu(restaurant.rid)
            } catch (err) {
                throw new ApolloError(err)
            }
            return menu.map(f => { return { fname: f.fname, price: f.price, category: f.category } })
        }
    },
};

const server = new ApolloServer({
    typeDefs, resolvers,
    context: ({ req }) => ({
        user: req
    })
});
router.use("/", server.getMiddleware({ path: "/" }))


module.exports = router;