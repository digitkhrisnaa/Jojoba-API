/*
* Author: digitkhrisnaa
*/

//Use mongoose dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//define schema for collections
var chat = new Schema({
    room_ids:{
        type:String,
        required: true
    },
    participant:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
    }],
    message:[{
            sender:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            body:{
                type:String
            },
            timeStamp:{
                type:Date
            }
    }]
});

//export file as module
module.exports = mongoose.model('Chat', chat);