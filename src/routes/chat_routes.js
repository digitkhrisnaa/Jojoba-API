/*
* Author: digitkhrisnaa
*/
var chat = require("../controller/chat_controller");

//Define routes for chat API
module.exports = function(app){
    app.post("/api/v1/chat/send", chat.sendMessage);
    app.get("/api/v1/chat/retrieve", chat.retrieveMessage);
}