const LocalStrategy = require('passport-local');
const userController = require('../controllers/user')
const _ = require('lodash')

const hash = function (password) {
    return password;
}

const localStrategy = new LocalStrategy(
    function (userName, password, done) {
        userController.findByUserName(userName, (err, user) => {
            if (err || !user || (hash(password) != user.passwordhash)) {
                return done(null, false)
            } else {
                return done(null, user);
            }
        })
    }
)

module.exports = { localStrategy } 