var mongoose = require("mongoose"),
    Session = require("../models/session.js"),
    crypto = require("crypto"),
    gcm = require("./gcm.js"),
    request = require("request"),
    controller = {}
    
function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

controller.index = [
    function(req, res) {
        console.log("start")
        Session.find(function(err, sessions) {
            var len = sessions.length
            if (len === 0) {
                res.json([{
                    'response': "No Groups Created"
                }])
            }
            else {
                var output = [];
                for(var i=0; i< len; i++){
                    output[i]= {
			            "name" : sessions[i].name,
                		"admin": sessions[i].admin,
                		"id": sessions[i]._id
            		}
                }
                res.json(output)
            }
        })
    }
]

// controller.index = [
//     function(req, res) {
//                 res.json([{}])

//     }
// ]

controller.getSession = [
    function(req, res) {
        Session.findById(req.params.sessionId, function(err,session){
            if(!err && session) {
                 var output={
                      "name": session.name,
                      "admin": session.admin,
                      "id": session.id,
                      "users": session.users
                    }
            res.json(output)
            }
            else {
                res.json({
                    'response':'Session not available'
                })
            }
        })
    }
]

controller.create = [
    function(req, res) {
        console.log("Session Create Process started");
        var started = false
        var reg_id = req.body.reg_id
        var rand_id = String(randomValueHex(15))+String(randomValueHex(15))

        if("name" in req.body && req.body.name !== '') {
            gcm.createGroup(rand_id,reg_id,function(response){
                console.log(response)
                var notification_key = JSON.parse(response).notification_key
                console.log(notification_key)
                if(notification_key && notification_key !== ''){
                    var newsession = new Session({
                        name: req.body.name,
                        password: req.body.password,
                        notification_key_name: rand_id,
                        notification_key: notification_key,
                        started: started,
                        admin: req.body.admin
                    })
                    Session.find({
                        name: req.body.name
                    }, function(err, sessions) {
                        var len = sessions.length

                        if (len === 0) {
                            newsession.save(function(err) {
                                var newId = String(newsession.id)
                                request(
                            		{ method: 'PUT',
                            		uri: 'https://test-erik-boege.c9.io/users/'+reg_id,
                            		form:{"session_id" : newId}
                            		}, function (error, response, body) {
                            			if(!error){
                            			    res.json({
                                                'response': "Sucessfully Created",
                                                'id': newsession._id
                                            })
                            			}
                            	    }
                            	 )
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
controller.changeSessionState = [
    function(req, res) {
        Session.findById(req.params.sessionId, function(err,session){
            var message = ""
            if(req.body.started==="true"){
                message = "Session started"
            } else if(req.body.started==="false"){
                message = "Session stopped"
            }
           gcm.sendMessage(session.notification_key, "Session",message, function(response){
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
controller.addNewUser = [
    function(req,res) {
        Session.findById(req.params.sessionId, function(err,sessionPW){
            if(!err && sessionPW){
                if(sessionPW.password===req.body.password){
                   Session.update({_id: req.params.sessionId}, {$push: {"users": {name : req.body.name}}}, function(err, session) {
                        if (!err && session) {
                            res.json({
                                'response': "Updated Sucessfully"
                            })
                        }
                        else {
                            res.json({
                                'response': "Error"
                            });
                        }
                    }) 
                } else {
                    res.json({
                        'response': "Wrong Password"
                    })
                }
            } else {
                res.json({
                    'response': "Error"
                })
            }
        })
    }
]
controller.deleteUser = [
    function(req, res) {
        //TODO Update Group to delete User
        res.end("PlaceHolder");
    }
]


module.exports = controller