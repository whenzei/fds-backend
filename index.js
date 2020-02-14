const express = require("express");
const app = express();
const customer = require('./routes/customer');
const rider = require('./routes/rider');
const staff = require('./routes/staff');
const manager = require('./routes/manager');
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