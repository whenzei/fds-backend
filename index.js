const express = require("express");
const app = express();
const customer = require('./customer');
const rider = require('./rider');
const staff = require('./staff');
const manager = require('./manager');
const morgan = require('morgan')

const port = process.env.PORT || "8000";

app.use(morgan('tiny'));
app.use('/customer', customer);
app.use('/rider', rider);
app.use('/staff', staff);
app.use('/manager', manager);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});