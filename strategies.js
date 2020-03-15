const LocalStrategy = require('passport-local');
const customerController = require('./controllers/customer')
const riderController = require('./controllers/rider')
const staffController = require('./controllers/staff')
const managerController = require('./controllers/manager')
const _ = require('lodash')

const hash = function (password) {
    return password;
}

const customerLocalStrategy = new LocalStrategy(
    function (userName, password, done) {
        customerController.findByUserName(userName, (err, user) => {
            if (err || !user || (hash(password) != user.passwordhash)) {
                return done(null, false)
            } else {
                return done(null, user);
            }
        })
    }
)

const riderLocalStrategy = new LocalStrategy(
    function (userName, password, done) {
        riderController.findByUserName(userName, (err, user) => {
            if (err || !user || (hash(password) != user.passwordhash)) {
                return done(null, false)
            } else {
                return done(null, user);
            }
        })
    }
)

const staffLocalStrategy = new LocalStrategy(
    function (userName, password, done) {
        staffController.findByUserName(userName, (err, user) => {
            if (err || !user || (hash(password) != user.passwordhash)) {
                return done(null, false)
            } else {
                return done(null, user);
            }
        })
    }
)

const managerLocalStrategy = new LocalStrategy(
    function (userName, password, done) {
        managerController.findByUserName(userName, (err, user) => {
            if (err || !user || (hash(password) != user.passwordhash)) {
                return done(null, false)
            } else {
                return done(null, user);
            }
        })
    }
)

module.exports = { customerLocalStrategy, riderLocalStrategy, staffLocalStrategy, managerLocalStrategy } 