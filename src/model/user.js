/*
* Author: digitkhrisnaa
*/

//Use mongoose dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//define schema for collections
var user = new Schema({
    fbid: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    url_photo:{
        type: String
    },
    dob: {
        type: Date
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    loc: {
        type:[Number],
        index: '2d'
    },
    religion: {
        type: String,
        enum: ['islam', 'christianity', 'hinduism', 'buddhism', 'other']
    },
    opLikes: {
        type: [String]
    },
    opRejects: {
        type: [String]
    },
    matched: [{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        room:{
            type:String
        }
    }],
    dateTimeCreated: {
        type: Date,
        default: Date.now
    },
    dateTimeUpdated: {
        type: Date
    },
    token_firebase: {
        type: String
    }
});

//export file as module
module.exports = mongoose.model('User', user);