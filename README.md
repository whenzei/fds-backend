Backend Application for Food Delivery Service.  
Written in Javascript with ExpressJs.  

# Database credentials setup ( :heavy_exclamation_mark: Must be done first)
* Put your Postgres password in db/index.js.

# Auto installation
Double click `run_backend.bat` to quickly fulfill dependencies and start the backend server ( :heavy_exclamation_mark: Make sure to setup database credentials first)

# Manual installation
``` bash
# install dependencies
npm install

# Setup database and fill with dummy data
node db/nuke.js

# Run server on localhost:8000
npm run dev
```
