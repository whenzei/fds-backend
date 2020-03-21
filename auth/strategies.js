const LocalStrategy = require('passport-local');
const { getUserByUid, getUserByUsername } = require('../controllers/user')
const _ = require('lodash')
const passportJWT = require("passport-jwt");
const { ExtractJwt } = passportJWT;
const JWT_SECRET_KEY = 'Jurong_west_secret_Tea'
const { Roles } = require('../auth/')

const hash = function (password) {
    return password;
}

const localStrategy = new LocalStrategy(
    async function (username, password, done) {
        let user;
        try {
            user = await getUserByUsername(username);
        } catch (err) {
            return done(null, false)
        }
        if (!user || (hash(password) != user.passwordhash)) {
            return done(null, false)
        } else {
            return done(null, user);
        }
    }
)

const jwtStrategyRider = new passportJWT.Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
},
    async function (jwtPayload, done) {
        let user;
        try {
            user = await getUserByUid(jwtPayload.uid);
        } catch (err) {
            return done(null, false)
        }
        if (!user || user.role != Roles.rider) {
            return done(null, false)
        } else {
            return done(null, user);
        }
    }
)

const jwtStrategyCustomer = new passportJWT.Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
},
    async function (jwtPayload, done) {
        let user;
        try {
            user = await getUserByUid(jwtPayload.uid);
        } catch (err) {
            return done(null, false)
        }
        console.log(user)
        if (!user || user.role != Roles.customer) {
            return done(null, false)
        } else {
            return done(null, user);
        }
    }
)

const jwtStrategyStaff = new passportJWT.Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
},
    async function (jwtPayload, done) {
        let user;
        try {
            user = await getUserByUid(jwtPayload.uid);
        } catch (err) {
            return done(null, false)
        }
        if (!user || user.role != Roles.staff) {
            return done(null, false)
        } else {
            return done(null, user);
        }
    }
)

const jwtStrategyManager = new passportJWT.Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
},
    async function (jwtPayload, done) {
        let user;
        try {
            user = await getUserByUid(jwtPayload.uid);
        } catch (err) {
            return done(null, false)
        }
        if (!user || user.role != Roles.manager) {
            return done(null, false)
        } else {
            return done(null, user);
        }
    }
)

module.exports = { localStrategy, jwtStrategyRider, jwtStrategyCustomer, jwtStrategyManager, jwtStrategyStaff, JWT_SECRET_KEY } 