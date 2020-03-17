const LocalStrategy = require('passport-local');
const userController = require('../controllers/user')
const _ = require('lodash')
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWT_SECRET_KEY = 'Jurong_west_secret_Tea'
const {Roles} = require('../auth/')

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

const jwtStrategyRider = new passportJWT.Strategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
},
    async function (jwtPayload, done) {
        return userController.findByUid(jwtPayload.uid, (err, user) => {
            if (err || user.role != Roles.rider) {
                console.log(err)
                return done(null, false)
            } else {
                return done(null, user)
            }
        })
    }
)

const jwtStrategyCustomer = new passportJWT.Strategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
},
    async function (jwtPayload, done) {
        return userController.findByUid(jwtPayload.uid, (err, user) => {
            if (err || user.role != Roles.customer) {
                console.log(err)
                return done(null, false)
            } else {
                return done(null, user)
            }
        })
    }
)

const jwtStrategyStaff = new passportJWT.Strategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
},
    async function (jwtPayload, done) {
        return userController.findByUid(jwtPayload.uid, (err, user) => {
            if (err || user.role != Roles.staff) {
                console.log(err)
                return done(null, false)
            } else {
                return done(null, user)
            }
        })
    }
)

const jwtStrategyManager = new passportJWT.Strategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
},
    async function (jwtPayload, done) {
        return userController.findByUid(jwtPayload.uid, (err, user) => {
            if (err || user.role != Roles.manager) {
                console.log(err)
                return done(null, false)
            } else {
                return done(null, user)
            }
        })
    }
)

module.exports = { localStrategy, jwtStrategyRider, jwtStrategyCustomer, jwtStrategyManager, jwtStrategyStaff, JWT_SECRET_KEY } 