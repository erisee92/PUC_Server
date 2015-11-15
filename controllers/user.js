var mongoose = require("mongoose"),
    User = require("../models/user.js"),
    controller = {}

controller.index = [
    function(req, res) {
        res.end("PlaceHolder")
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

            var len = users.length

            if (len === 0) {
                newuser.save(function(err) {

                    res.json({
                        'response': "Sucessfully Registered"
                    })
                    if (err) return next(err)
                })
            }
            else {

                res.json({
                    'response': "User already Registered"
                })

            }

            if (err) return next(err)
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