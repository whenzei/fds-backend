const buildings = require('../assets/addresses.json')

const getAddresses = function (searchStr) {
    const LIMIT = 10;
    const res = [];
    const str = searchStr.toLowerCase();
    let count = 0;
    for (building of buildings) {
        if(count >= LIMIT) break; 
        if (!((building.address).toLowerCase()).includes(str)) {
            continue;
        }
        res.push(building);
        count++;
    }
    return res;
}

module.exports = {
    getAddresses
}