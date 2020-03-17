const express = require('express')
const router = express.Router()
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql')

router.get("/", (req, res) => res.send(`Hi I'm ${req.user.name}. I'm a ${req.user.role}.`))

const schema = buildSchema(`
    type Restaurant {
        rid: Int!
        rname: String!
        menu: [Food!]!
        minSpend: Int!
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
        totalPrice: Int!
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
    }

    schema {
        query: RootQuery
    }
`)
const graphqlMiddleware = graphqlHTTP({
    schema: schema,
    pretty: true,
    rootValue: {
        me: () => { return { cname: "lala", username: "adr", addresses: [] } }
    },
    graphiql: true,
})

router.use('/graphql', graphqlMiddleware,);

module.exports = router;