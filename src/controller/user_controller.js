/*
* Author: digitkhrisnaa
*/

/*
* controller for user routes
*/

//import all dependencies
var jwt = require("jsonwebtoken");
var User = require("../model/user");
var config = require("../util/config");

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON User
* @desc: module signin user
*/
module.exports.signin = function (req, res){
    var birthSplit, resultSplit, resultAge;
    if(req.body.fbid != null){
        var token = jwt.sign({fbid:req.body.fbid}, config.secret);
        //Find user that exists or not
        User.findOne({fbid: req.body.fbid}, function(err, user){
            if (err)throw err;
            if(req.body.dob){
                birthSplit = req.body.dob
                resultSplit = birthSplit.split("-");
                resultAge = calculate_age(resultSplit[1], resultSplit[2], resultSplit[0]);
            }

            /*
            * User is exist login with update data (age and location) otherwise input as new user
            */
            if(user != null){
                var updateUser = {};

                if(req.body.dob){ 
                    updateUser.dob = req.body.dob;
                    updateUser.age = resultAge;
                }
                if(req.body.loc) updateUser.loc = req.body.loc.split(',');
                updateUser.dateTimeUpdated = new Date();

                User.update({_id:user._id}, {$set: updateUser}, function(err){
                    if (err) return res.json({success:false, message:"Bad Request"});
                    User.findOne({_id: user._id}, function(err, data){
                        return res.json({
                            status:200, 
                            message:"Login success with data", 
                            token: "bearer " + token,
                            data: data
                        });
                    });
                });
            }else{
                var userData = {
                    fbid:req.body.fbid,
                    name:req.body.name,
                    url_photo:req.body.url_photo,
                    gender:req.body.gender,
                }

                if(req.body.dob){ 
                    userData.dob = req.body.dob;
                    userData.age = resultAge;
                }
                if(req.body.loc) userData.loc = req.body.loc.split(',');
                if(req.body.religion) userData.religion = req.body.religion
                
                var newUser = new User(userData);
                newUser.save(function(err, data){
                    if (err) return res.json({status:500, message:"Internal server error"});
                    return res.json({
                        status:200, 
                        message:"Login success with data", 
                        token: "bearer " + token,
                        data:data
                    });
                });
            }
        });
    }else{
        return res.json({status:400, message:"Bad Request"});
    }
}

/*
* @params: request -> HTTP, result -> HTTP
* @return: JSON User
* @desc: module update data user
*/
module.exports.updateData = function(req, res){
    var birthSplit, resultSplit, resultAge;
    if(req.body.fbid != null){
        User.findOne({fbid: req.body.fbid}, function(err, user){
            if(err) throw err;
            
            //define age of user
            if(req.body.dob){
                birthSplit = req.body.dob
                resultSplit = birthSplit.split("-");
                resultAge = calculate_age(resultSplit[1], resultSplit[2], resultSplit[0]);
            }

            /*
            * User is exist and update data otherwise return with no content of updated data
            */
            if(user != null){
                var updateUser = {};

                if(req.body.dob){
                    updateUser.dob = req.body.dob;
                    updateUser.age = resultAge;
                }
                if(req.body.url_photo) updateUser.url_photo = req.body.url_photo;
                if(req.body.religion) updateUser.religion = req.body.religion;
                if(req.body.loc) updateUser.loc = req.body.loc.split(',');
                if(req.body.token_firebase) updateUser.token_firebase = req.body.token_firebase;
                updateUser.dateTimeUpdated = new Date();

                User.update({_id:user._id}, {$set: updateUser}, function(err){
                    if (err) throw err.message
                    User.findOne({_id: user._id}, function(err, data){
                        return res.json({
                            status:200, 
                            message:"Update success with data",
                            data: data
                        });
                    });
                });

            }else{
                return res.json({status:204, message:"Success with no content"});
            }
        });
    }else{
        return res.json({status:400, message:"Bad Request"});
    }
}

/*
* @params: month -> Integer, day -> Integer, year -> Integer
* @return: age -> Integer
* @desc: calculate age from date of birth
*/
function calculate_age(birth_month,birth_day,birth_year)
{
    today_date = new Date();
    today_year = today_date.getFullYear();
    today_month = today_date.getMonth();
    today_day = today_date.getDate();
    age = today_year - birth_year;

    if ( today_month < (birth_month - 1))
    {
        age--;
    }
    if (((birth_month - 1) == today_month) && (today_day < birth_day))
    {
        age--;
    }
    return age;
}