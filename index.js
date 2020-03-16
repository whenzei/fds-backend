const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const logger = require('morgan');
const strategies = require('./auth/strategies');
const userController = require('./controllers/user')
const passport = require('passport')

const customerRouter = require('./routes/customer');
const loginRouter = require('./routes/login');
const riderRouter = require('./routes/rider');
const staffRouter = require('./routes/staff');
const managerRouter = require('./routes/manager');

const port = process.env.PORT || "8000";

app.use(session({ secret: "lalalalala" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
    userController.findByUid(uid, (err, user) => done(err, user))
});

passport.use('local', strategies.localStrategy);

app.use(logger('tiny'));

app.use('/login', loginRouter);
app.use('/customer', customerRouter);
app.use('/rider', riderRouter);
app.use('/staff', staffRouter);
app.use('/manager', managerRouter);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});