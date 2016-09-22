/*
* Author: digitkhrisnaa
*/
var users = require ("../controller/user_controller");

//Define all routes of users
module.exports = function(app){
    app.post('/api/v1/login', users.signin);
    app.post('/api/v1/update', users.updateData);
}