var mongoose = require("mongoose"),
    User = require("../models/user.js"),
    gcm = require("./gcm.js"),
    controller = {}

controller.index = [
    function(req, res) {
        User.find(function(err, users) {
            var len = users.length

            if (len === 0) {
                res.json({
                    'response': "No Users Registered"
                })
            }
            else {
                res.json(users)
            }
        })
    }
]

controller.create = [
    function(req, res) {

        var newuser = new User({
            name: req.body.name,
            username: req.body.username,
            reg_id: req.body.reg_id,
            session_id: null
        })
        console.log(newuser);

        User.find({
            username: req.body.username
        }, function(err, users) {
            var len = users.length

            if (len === 0) {
                newuser.save(function(err) {
                    res.json({
                        'response': "Sucessfully Registered",
                        'id': newuser._id,
                        'username': newuser.username,
                        'name': newuser.name
                    })
                })
            }
            else {
                console.log("User already registered")
                res.json({
                    'response': "User already Registered"
                })
            }
        })
    }
]
controller.update = [
    function(req,res) {
        console.log(req.params)
        console.log(req.body)
        User.update({reg_id: req.params.userId}, {$set: {session_id : req.body.session_id}}, function(err, user) {
            if (!err && user) {
                User.findOne({reg_id: req.params.userId}).populate("session_id").exec(function(err,user2){
                   if(!err && user2) {
                        gcm.addToGroup(user2.session_id.notification_key_name, user2.session_id.notification_key,user2.reg_id,function(response){
                            console.log(response)
                            res.json({
                                'response': "Updated Sucessfully"
                            });
                        })
                    } 
                    else {
                            res.json({
                                'response': "Error"
                            });
                    }
                })
            }
            else {
                res.json({
                    'response': "Error"
                });
            }
        })
    }
]
controller.delete = [
    function(req, res) {
        User.findOne({_id: req.params.userId}).populate("session_id").exec(function(err,user){
            if(!err && user) {
                console.log("start deletion")
                if(user.session_id){
                    gcm.deleteFromGroup(user.session_id.notification_key_name,user.session_id.notification_key,user.reg_id,function(response){
                        console.log(response)
                        if(JSON.parse(response).notification_key){
                            User.remove({ _id: req.params.userId }, function(err, user) {
                                if (!err) {
                                    res.json({
                                        'response': "Removed Sucessfully"
                                    });
                                }
                                else {
                                    res.json({
                                        'response': "Error"
                                    });
                                }
                            })
                        } else {
                            res.json({
                                'response': "GCM Error but removed"
                            });
                        }
                    })
                } else {
                    User.remove({ _id: req.params.userId }, function(err, user) {
                        if (!err) {
                            res.json({
                                'response': "Removed Sucessfully"
                            });
                        }
                        else {
                            res.json({
                                'response': "Error"
                            });
                        }
                    })
                }
            } else {
                res.json({
                    'response':'User not registered'
                })
            }
        })
    }
]
controller.deleteSession = [
    function(req, res) {
        User.findOne({username: req.params.username}).populate("session_id").exec(function(err,user){
            if(!err && user) {
                console.log("start Session deletion")
                if(user.session_id){
                    gcm.deleteFromGroup(user.session_id.notification_key_name,user.session_id.notification_key,user.reg_id,function(response){
                        console.log(response)
                        if(JSON.parse(response).notification_key){
                            User.update({ username: req.params.username }, {$unset: {'session_id' : ""}}, function(err, user) {
                                if (!err) {
                                    res.json({
                                        'response': "Removed Sucessfully"
                                    });
                                }
                                else {
                                    res.json({
                                        'response': "Error"
                                    });
                                }
                            })
                        } else {
                            res.json({
                                'response': "GCM Error but removed"
                            });
                        }
                    })
                } else {
                    res.json({
                        'response': "Error"
                    });
                }
            } else {
                res.json({
                    'response':'User not registered'
                })
            }
        })
    }
]

module.exports = controller