Backend Application for Food Delivery Service.  
Written in Javascript with ExpressJs.  

# Getting started
* Ensure that latest version of Node is installed
* Run `npm install` to install the node modules.
* Run `npm run dev` to get the application running on your machine.  
(Check that it is up and running on [http://localhost:8000](http://localhost:8000) )

# Database setup
* To use default database connection, login to psql as postgres and add new database called fds. Password for postgres should be the same as in db/index.js.
* To use custom database/password, change settings in db/index.js
* Run `node db/createTables.js` to create tables in database if not done so already