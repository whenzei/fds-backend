const db = require('./index')

TABLES_TO_DROP = ["Customers", "Staff", "Riders", "Managers"]

db.none("DROP table " + TABLES_TO_DROP.join(","))
    .then(data => {
        console.log("Dropped tables");
    })
    .catch(error => {
        console.log(error);
    });