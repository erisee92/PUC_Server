var mongoose = require("mongoose"),
    Session = require("../models/session.js"),
    gcm = require("./gcm.js"),
    controller = {}

controller.index = [
    function(req, res) {
        console.log("start")
        Session.find(function(err, sessions) {
            var len = sessions.length

            if (len === 0) {
                res.json({
                    'response': "No Groups Created"
                })
            }
            else {
                res.json(sessions)
            }
        })
    }
]

controller.create = [
    function(req, res) {
        var started = false
        var user_id = req.body.user_id

        if("name" in req.body && req.body.name !== '') {
            gcm.createGroup(req.body.name,user_id,function(response){
                console.log(response)
                var notification_key = JSON.parse(response).notification_key
                if(notification_key && notification_key !== ''){
                    var newsession = new Session({
                        name: req.body.name,
                        passwort: req.body.passwort,
                        notification_key: notification_key,
                        started: started
                    })

                    Session.find({
                        name: req.body.name
                    }, function(err, sessions) {
                        var len = sessions.length

                        if (len === 0) {
                            newsession.save(function(err) {
                                res.json({
                                    'response': "Sucessfully Created",
                                    'id': newsession._id
                                })
                            })
                        }
                        else {
                            res.json({
                                'response': "Session Name already in use"
                            })
                        }
                    })
                } else {
                    res.json({
                        'response': "Group creation error"
                    })
                }
            })
        } else {
            res.json({
                'response': "Please add a name"
            })
        }
    }
]
controller.update = [
    function(req, res) {
        Session.findById(req.params.sessionId, function(err,session){
            var message = ""
            if(req.body.started==="true"){
                message = "Session started"
            } else if(req.body.started==="false"){
                message = "Session stopped"
            }
           gcm.sendMessage(session.notification_key, message, function(response){
               console.log(response)
               Session.update({_id: req.params.sessionId}, {$set: {started : req.body.started}}, function(err, session) {
                    if (!err && session) {
                        res.json({
                            'response': message
                        });
                    }
                    else {
                        res.json({
                            'response': "Error"
                        });
                    }
                })
           })
        })
    }
]
controller.delete = [
    function(req, res) {
        //TODO Create Session Delete Function
        res.end("PlaceHolder");
    }
]

module.exports = controller