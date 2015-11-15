var mongoose = require("mongoose"),
    User = require("../models/user.js"),
    controller = {}

controller.index = [
    function(req, res, next) {
        User.find(function(err, users) {
            if (err) return next(err);
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
    function(req, res, next) {

        var newuser = new User({
            name: req.body.name,
            username: req.body.username,
            reg_id: req.body.reg_id
        })

        User.find({
            username: req.body.username
        }, function(err, users) {
            if (err) return next(err)
            var len = users.length

            if (len === 0) {
                newuser.save(function(err) {
                    if (err) return next(err)
                    res.json({
                        'response': "Sucessfully Registered"
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
        res.end("PlaceHolder")
    }
]

module.exports = controller