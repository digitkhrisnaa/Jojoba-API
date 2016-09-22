/*
* Author: digitkhrisnaa
*/

//import dependecies
var express = require ("express");
var expressJWT = require("express-jwt");
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var config = require("./src/util/config");
var user = require("./src/model/user");
var userRoutes = require("./src/routes/user_routes");
var coreRoutes = require("./src/routes/core_routes");
var chatRoutes = require("./src/routes/chat_routes");

//Connect to mongodb with mongoosee dependecies
var db = mongoose.connect("mongodb://localhost:27017/tinder_clone");

//Use express
var app = express();

//Set bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Except JWT header for login path
app.use(expressJWT({secret:config.secret}).unless({path:['/api/v1/login']}));

//Create routes
userRoutes(app);
coreRoutes(app);
chatRoutes(app);

//Open port and start application
app.listen(config.port, () => console.log('App started listening on port', 8080));