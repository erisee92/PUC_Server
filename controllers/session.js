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
                var notification_key = response.notification_key
                console.log(notification_key)
                if(notification_key && notification_key !== ''){
                    var newsession = new Session({
                        name: req.body.name,
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
        var started = false
        var user_id = req.body.user_id

        if("name" in req.body && req.body.name !== '') {
            gcm.createGroup(req.body.name,user_id,function(response){
                console.log(response)
                var notification_key = response.notification_key
                console.log(notification_key)
                if(notification_key && notification_key !== ''){
                    var newsession = new Session({
                        name: req.body.name,
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
controller.delete = [
    function(req, res) {
        res.end("PlaceHolder");
    }
]

module.exports = controller