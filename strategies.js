const LocalStrategy = require('passport-local');
const customerController = require('./controllers/customer')
const _ = require('lodash')

const customerLocalStrategy = new LocalStrategy(
    function(userName, password, done) {
        customerController.findByUserName(userName)
        .then((user) => {
            console.log(user)
            if (!user || user.password != password) {
                return done(null, false)
            }
            return done(null, user);
        })
    }
)

module.exports = {customerLocalStrategy}