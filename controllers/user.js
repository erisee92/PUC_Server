var mongoose = require("mongoose"),
    User = require("../models/user.js"),
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
            reg_id: req.body.reg_id
        })

        User.find({
            username: req.body.username
        }, function(err, users) {
            var len = users.length

            if (len === 0) {
                newuser.save(function(err) {
                    res.json({
                        'response': "Sucessfully Registered",
                        'id': newuser._id
                    })
                })
            }
            else {
                res.json({
                    'response': "User already Registered"
                })
            }
        })
    }
]
controller.update = [
    function(req, res) {
        res.end("PlaceHolder")
    }
]
controller.delete = [
    function(req, res) {

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
]

module.exports = controller