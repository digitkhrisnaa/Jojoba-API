/*
* Author: digitkhrisnaa
*/

/*
* controller for chat routes
*/

//import all dependencies
var Chat = require("../model/chat");
var config = require("../util/config");
var fcm_module = require("../util/fcm");
var async = require("async");

var push = new fcm_module();

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON
* @desc: Send message to unique chat room use firebase cloud messaging with spesific token
*/
module.exports.sendMessage = function(req, res){
    if(!req.body.roomid || !req.body.fbid) return res.json({status:400, message:"Bad Request"});

    Chat.findOne({room_ids:req.body.roomid}).populate('participant').exec(function(err, data){
        if(err) return res.json({status:500, message:"Internal server error " + err.toString()});
        if(data == null) return res.json({status:204, message:"Rooms not found"});
        var dataPush = {
            sender:search(data.participant, req.body.fbid, 1), //enum 1 is for looking sender collection
            body:req.body.message,
            timeStamp: new Date()
        }
        data.message.push(dataPush);
        data.save();
        var partnerToken = search(data.participant, req.body.fbid, 2) //enum 2 is for looking partner collection
        var pushProperty = {
            token_firebase:partnerToken.token_firebase,
            message:req.body.message
        }

        push.send_message(pushProperty);

        return res.json({status:200, message:"Success send message"});
    });
}

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON
* @desc: Retrieve message from database with unique room
*/
module.exports.retrieveMessage = function(req, res){
    if(!req.query.roomid) return res.json({status:400, message:"Bad Request"});

    var result = [];
    Chat.findOne({room_ids:req.query.roomid}).populate('message.sender').exec(function(err, data){
        data.message.forEach(function(element) {
            var datas = {
                senderFbid:element.sender.fbid,
                senderName:element.sender.name,
                senderPhoto:element.sender.url_photo,
                bodyMessage:element.body,
                bodyTimeStamp:element.timeStamp
            }

            result.push(datas);
        }, this);
        return res.json({status:200, message:"Success", data:result});
    });
}

/*
* @params: collection -> List, fbid -> String
* @return: List
* @desc: search user in collection
*/
function search(collection, fbid, searchMethod){
    var op = 0;
    for (var i=0; i < collection.length; i++) {
        if(searchMethod === 1){ //looking for current fbid
            if (collection[i].fbid === fbid) {
                return collection[i];
            }
        }else{ //looking for partner fbid
            if(collection[i].fbid !== fbid){
                return collection[i];
            }
        }
    }
}