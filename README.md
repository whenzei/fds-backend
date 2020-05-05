Backend Application for Food Delivery Service.  
Written in Javascript with ExpressJs.  

# Database credentials setup ( :heavy_exclamation_mark: Must be done first)
* Put your Postgres username and password in db/index.js. Default username is postgres.

# Quick start
Double click run_backend.bat to quickly fulfill dependencies and start the backend server (Make sure to setup database credentials first)

# Manual installation
## 1. Node setup
* Ensure that latest version of Node is installed
* Run `npm install` to install the node modules.

## 2. Database setup
* Run `node nuke.js` to init db, apply schema and generate dummy data

## 3. Run server
* Run `npm run dev` to get the application running on your machine.  
(Check that it is up and running on [http://localhost:8000](http://localhost:8000) )

