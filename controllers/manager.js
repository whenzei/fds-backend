const { Roles } = require('../auth/index');
const { getNextUid } = require('../controllers/user');
const { addRider, addStaff } = require('../db/fillTableMethods');


const addUser = async (user) => {
    try {
        if(user == null) {
            return;
        }
        uid = await getNextUid();
        
        if (user.role == Roles.staff) {
            riderData = [null, 'S', user.name, user.username, 'salt', user.password, user.rid];
            await addStaff(riderData);
        } else if (user.role == Roles.rider){
            riderData = [null, 'R', user.name, user.username, 'salt', user.password];
            await addRider(riderData);
        } else {
            throw "Not authorised to add the user";
        }
    } catch (err) {
        throw (err, "User could not be added");
    }
}

module.exports = {
    addUser
}