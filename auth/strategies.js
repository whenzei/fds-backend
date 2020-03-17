const LocalStrategy = require('passport-local');
const userController = require('../controllers/user')
const _ = require('lodash')
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;

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

const jwtStrategy = new passportJWT.Strategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'JWWWWWWTTTSECRET_FANTASY'
},
    function (jwtPayload, done) {
        console.log("HIIIIIIIIIII")
        return userController.findByUid(jwtPayload.uid, (err, user) => {
            if (err) {
                console.log(err)
                return done(null, false)
            } else {
                return done(null, user)
            }
        })
    }
)

module.exports = { localStrategy, jwtStrategy } 