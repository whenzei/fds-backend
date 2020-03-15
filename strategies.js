const LocalStrategy = require('passport-local');
const customerController = require('./controllers/customer')
const riderController = require('./controllers/rider')
const staffController = require('./controllers/staff')
const managerController = require('./controllers/manager')
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

const staffLocalStrategy = new LocalStrategy(
    function(userName, password, done) {
        staffController.findByUserName(userName)
        .then((user) => {
            if (!user || user.password != password) {
                return done(null, false)
            }
            return done(null, user);
        })
    }
)

const managerLocalStrategy = new LocalStrategy(
    function(userName, password, done) {
        managerController.findByUserName(userName)
        .then((user) => {
            if (!user || user.password != password) {
                return done(null, false)
            }
            return done(null, user);
        })
    }
)

module.exports = {customerLocalStrategy, riderLocalStrategy, staffLocalStrategy, managerLocalStrategy} 