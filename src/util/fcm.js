/*
* Author: digitkhrisnaa
*/

/*
* fcm.js for handle firebase push notification to client
*/

//import dependencies
var config = require("./config");
var FCM = require("fcm-node");

//Get server key
var serverKey = config.server_key_fcm;
var cm = new FCM(serverKey);

var fcm_module = function(){};

/*
* @Params: data
* @Desc: push notification if match to client using firebase
*/
fcm_module.prototype.push_match = function(data){
    var message = {
        registration_ids : data.token_firebase,
        notification : {
        body : 'You got a matched',
        title : 'Found match',
        },
        data : {
                fbid:data.fbid,
                name:data.name,
                url_photo:data.url_photo,
                dob:data.dob,
                age:data.age,
                gender:data.gender,
                religion:data.religion
            }
    }

    cm.send(message, function(err, response){
        if(err){
            console.log("Something has gone wrong");
        }else{
            console.log("Successfully sent with response: " + response);
        }
    });
}

/*
* @Params: data
* @Desc: push notification for chat by room to client using firebase
*/
fcm_module.prototype.send_message = function(data){
    var message = {
        to : data.token_firebase,
        notification : {
            body : data.message,
            title : 'Jojoba',
        }
    }

    console.log(message);
    cm.send(message, function(err, response){
        if(err){
            console.log("Something has gone wrong " + err.toString());
        }else{
            console.log("Successfully sent with response: " + response);
        }
    });
}

module.exports = fcm_module;
