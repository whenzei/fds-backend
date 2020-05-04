const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const logger = require('morgan');
const strategies = require('./auth/strategies');
const passport = require('passport')
const cors = require('cors');

const customerRouter = require('./routes/customer');
const customerSignupRouter = require('./routes/customerSignup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const riderRouter = require('./routes/rider');
const staffRouter = require('./routes/staff');
const managerRouter = require('./routes/manager');
const signupBusinessRouter = require('./routes/signupBusiness');

const port = process.env.PORT || "8000";

app.use(cors());
app.use(session({ secret: "lalalalala" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', strategies.localStrategy);
passport.use('jwt-rider', strategies.jwtStrategyRider);
passport.use('jwt-manager', strategies.jwtStrategyManager);
passport.use('jwt-customer', strategies.jwtStrategyCustomer);
passport.use('jwt-staff', strategies.jwtStrategyStaff);

app.use(logger('tiny'));

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/customer-signup', customerSignupRouter);
app.use('/signupBusiness', passport.authenticate('jwt-manager', {session: false}), signupBusinessRouter);
app.use('/customer', passport.authenticate('jwt-customer', {session: false}),customerRouter);
app.use('/rider', passport.authenticate('jwt-rider', {session: false}),riderRouter);
app.use('/staff', passport.authenticate('jwt-staff', {session: false}),staffRouter);
app.use('/manager', passport.authenticate('jwt-manager', {session: false}),managerRouter);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});