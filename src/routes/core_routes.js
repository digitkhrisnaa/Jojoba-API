/*
* Author: digitkhrisnaa
*/
var cores = require("../controller/core_controller");

//Define routes for core logic
module.exports = function(app){
    app.get("/api/v1/findmatch", cores.findMatch);
    app.get("/api/v1/findmatch/like", cores.matchLike);
    app.get("/api/v1/findmatch/reject", cores.matchReject);
    app.get("/api/v1/findmatch/match", cores.matched);
    app.get("/api/v1/findmatch/unmatch", cores.unmatch);

    //Request tyo
    app.post("/api/v1/clear", cores.clear);
}