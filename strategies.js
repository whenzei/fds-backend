const LocalStrategy = require('passport-local');
const customerController = require('./controllers/customer')
const riderController = require('./controllers/rider')
const _ = require('lodash')

const customerLocalStrategy = new LocalStrategy(
    function(userName, password, done) {
        customerController.findByUserName(userName)
        .then((user) => {
            if (!user || user.password != password) {
                return done(null, false)
            }
            return done(null, user);
        })
    }
)

const riderLocalStrategy = new LocalStrategy(
    function(userName, password, done) {
        riderController.findByUserName(userName)
        .then((user) => {
            if (!user || user.password != password) {
                return done(null, false)
            }
            return done(null, user);
        })
    }
)

module.exports = {customerLocalStrategy, riderLocalStrategy} 