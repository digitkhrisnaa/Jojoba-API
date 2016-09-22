/*
* Author: digitkhrisnaa
*/

/*
* controller for core routes
*/

//import all dependencies
var User = require("../model/user");
var Chat = require("../model/chat");
var fcm_module = require("../util/fcm");
var async = require("async");
var shortid = require('shortid');

//Define firebase module (firebase cloud messaging)
var push = new fcm_module();

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON list of people that match with user
* @desc: Find match people of user
*/
module.exports.findMatch = function(req, res){
    if(!req.query.fbid) return res.json({status:400, message:"Bad Request"});
    
    User.findOne({fbid:req.query.fbid}, function(err, user){
        if(err) return res.json({status:500, message:"Internal server error"});
        if(user != null){
            //variable object with JSON for query mongodb collections
            var object = {};
            var pagination = parseInt(req.query.pagination) || 10;
            var radius = parseInt(req.query.nearRadius) || 500;

            var religion = req.query.religion;
            var age = req.query.age;
            var gender = req.query.gender;

            if(gender){
                object.gender = {"$eq":gender};
            }

            if(age){
                age = age.split("-");
                if(age.length > 1){
                    object.age = {"$gte":age[0], "$lte":age[1]};
                }else{
                    object.age = {"$eq":age};
                }
            }

            if(religion){
                object.religion = {"$eq":religion};
            }

            object.loc = {"$near":user.loc, "$maxDistance": radius};
            var array = [];
            var ids = array.concat(user.fbid, user.opLikes, user.opRejects);
            object.fbid = {"$nin":ids};

            User.find(object).limit(pagination).exec(function(err, data){
                if(err) return res.json({status:500, message:"Internal server error"});
                if(data.length >= 1) {
                    var resultArray = [];
                    data.forEach(function(element, index, array){
                        resultArray.push( {
                            "fbid":data[index].fbid,
                            "name":data[index].name,
                            "url_photo":data[index].url_photo,
                            "dob":data[index].dob,
                            "age":data[index].age,
                            "gender":data[index].gender,
                            "loc":data[index].loc,
                            "religion":data[index].religion
                        });
                    });
                    return res.json({status:200, message:"Found match", data:resultArray});
                }
                else return res.json({status:204, message:"Cannot find opponent, result with no content"});
            });
        }
        else{
            return res.json({status:204, message:"User not found, result with no content"});
        }
    });
}

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON
* @desc: like people method, if user like each other than send push notification to client that user match each other and create
*           room for private chat
*/
module.exports.matchLike = function(req, res){
    if(!req.query.fbid || !req.query.partnerId) return res.json({status:400, message:"Bad Request"});

    var status = false;
    User.findOne({fbid:req.query.fbid}, function(err, user){
        User.findOne({fbid:req.query.partnerId}, function(err, partnerUser){
            user.opLikes.push(partnerUser.fbid);
            var partnerLikes = partnerUser.opLikes.indexOf(req.query.fbid);

            if(partnerLikes >= 0){
                var roomids = shortid.generate();
                var userMt = {
                    user:partnerUser,
                    room:roomids
                }

                var partnerMt = {
                    user:user,
                    room:roomids
                }
                user.matched.push(userMt);
                partnerUser.matched.push(partnerMt);
                addUserToRoomChat(roomids, user, partnerUser);
                
                push.push_match({
                    fbid:partnerUser.fbid,
                    name:partnerUser.name,
                    url_photo:partnerUser.url_photo,
                    dob:partnerUser.dob,
                    age:partnerUser.age,
                    gender:partnerUser.gender,
                    religion:partnerUser.religion,
                    token_firebase:[user.token_firebase, partnerUser.token_firebase]
                });
                status = true;
            }
            
            user.save();
            partnerUser.save();
            return res.json({status:200, message:"Success like", match:status});
        });
    });
}

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON
* @desc: reject people if user doesn't like. People that rejected will not show for user later
*/
module.exports.matchReject = function(req, res){
    if(!req.query.fbid || !req.query.partnerId) return res.json({status:400, message:"Bad Request"});

    User.findOne({fbid:req.query.fbid}, function(err, user){
        if(err) return res.json({status:500, message:"Internal server error"});
        if(user!= null){
            user.opRejects.push(req.query.partnerId);
            user.save(function(err){
                if(err) return res.json({status:500, message:"Internal server error"});
                return res.json({status:200, message:"Success reject opponent"});
            });
        }else{
            return res.json({status:204, message:"User not found, result with no content"});
        }
    });
}

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON list of match user
* @desc: show list of match people with user
*/
module.exports.matched = function(req, res){
    if(!req.query.fbid) return res.json({status:400, message:"Bad Request"});

    var fbid = req.query.fbid;

    async.waterfall([
        function(callback){
            User.findOne({fbid:fbid}).populate('matched.user').exec(function(err, data){
                if(err) throw err;
                if(data != null){
                    callback(null, data);
                }else{
                    callback(new Error("Not found"), null);
                }
            });
        },
        function(data, callback){
            var resultMatch =[];
            if(data != null){
                async.eachSeries(data.matched, function(value, callback){
                    resultMatch.push({
                        fbid:value.user.fbid,
                        name:value.user.name,
                        url_photo:value.user.url_photo,
                        dob:value.user.dob,
                        age:value.user.age,
                        gender:value.user.gender,
                        religion:value.user.religion,
                        roomchat:value.room
                    });
                    callback(null, resultMatch);
                }, function(err, result){
                    callback(null, resultMatch);
                });
            }else{
                callback(new Error("Not found"), null);
            }
        }
    ], function(err, result){
        if(err)return res.json({status:500, message:"Error internal server"});
        if(result.length < 1) return res.json({status:204, message:"Success with no data"});
        return res.json({status:200, message:"Success", data: result});
    });
}

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON
* @desc: unmatch user, people that unmatch will be show to user later
*/
module.exports.unmatch = function(req, res){
    if(!req.query.fbid || !req.query.partnerId) return res.json({status:500, message:"Internal server error"});

    async.parallel([
        function(callback){
            User.findOne({fbid:req.query.fbid}).populate('matched.user').exec(function(err, data){
                if(data != null){
                    var match_ids = data.matched.findIndex(x => x.user.fbid == req.query.partnerId);
                    var like_ids = data.opLikes.indexOf(req.query.partnerId);

                    if(match_ids >= 0){
                        data.matched.splice(match_ids, 1);
                    }

                    if(like_ids >= 0){
                        data.opLikes.splice(like_ids, 1);
                    }
                    
                    data.save(function(err){
                        if(err)throw err;
                        callback(null, true);
                    });
                }else{
                    callback(new Error("Bad request"), false);
                }
            });
        },
        function(callback){
            User.findOne({fbid:req.query.partnerId}).populate('matched.user').exec(function(err, data){
                if(data != null){
                    var match_ids = data.matched.findIndex(x => x.user.fbid == req.query.fbid);
                    var like_ids = data.opLikes.indexOf(req.query.fbid);
                    var rooms = data.matched[match_ids].room;

                    Chat.remove({room_ids:rooms}, function(err){
                        if(err) throw err;
                    });

                    if(match_ids >= 0){
                        data.matched.splice(match_ids, 1);
                    }

                    if(like_ids >= 0){
                        data.opLikes.splice(like_ids, 1);
                    }

                    data.save(function(err){
                        if(err)throw err;
                        callback(null, true);
                    });
                }else{
                    callback(new Error("Bad request"), false);
                }
            });
        }
    ], function(err, result){
        if(err) return res.json({status:500, message:err.toString()});
        if(result){
            return res.json({status:200, message:"Unmatch success"});
        }
    });
}

/*
* Clear data like, reject, and match for development only
*/
module.exports.clear = function(req, res){
    if(req.body.fbid){
        User.findOne({fbid:req.body.fbid}, function(err, user){
            if(err) return res.json({status:500, message:"Internal server error"});
            if(user != null){
                user.opLikes = [];
                user.opRejects = [];
                user.matched = [];

                user.save(function(err){
                    if(err) return res.json({status:500, message:"Internal server error"});
                    return res.json({status:200, message:"Clear Success"});
                });
            }else{
                return res.json({status:204, message:"User not found, result with no content"});
            }
        });
    }else{
        res.json({status:400, message:"Bad request"});
    }
}

/*
* @params: roomid -> String, userData -> JSON, partnerData -> JSON
* @desc: add user that match each other to unique room for private chat
*/
function addUserToRoomChat(roomId, userData, partnerData){
    var roomObj = {
        room_ids:roomId,
        participant:[userData, partnerData]
    }
    var newRoom = new Chat(roomObj);
    newRoom.save();
}