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
                		"id": sessions[i]._id,
                		"state": sessions[i].started
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
                        admin: req.body.admin,
                        users: [{name: req.body.admin, username: req.body.adminusername}]
                    })
                    Session.find({name: req.body.name}, function(err, sessions) {
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
        console.log(req.body.started)
        Session.findById(req.params.sessionId, function(err,session){
            if (!err && session) {
                var type = ""
                var head = ""
                var body = ""
                if(req.body.started==="true"){
                    type = "started"
                    head = "Started!"
                    body =  "Don't use your Phone ;)"
                } else if(req.body.started==="false"){
                    type = "stopped"
                    head = "Stopped!"
                    body =  "You can use your Phone now \\o/"
                }
               gcm.sendMessage(session.notification_key, type, head, body, function(response){
                   console.log(response)
                   Session.update({_id: req.params.sessionId}, {$set: {started : req.body.started}}, function(err, session) {
                        if (!err && session) {
                            res.json({
                                'response': type
                            });
                        }
                        else {
                            res.json({
                                'response': "Error"
                            });
                        }
                    })
               })
            }else{
                res.json({
                    'response': "Error"
                }); 
            }   
        })
    }
]
controller.delete = [
    function(req, res) {
        Session.findOne({_id: req.params.sessionId}).exec(function(err,session){
            if(!err && session) {
                console.log("start deletion")
                console.log(session)
                gcm.sendMessage(session.notification_key,"delete","Session removed","Session removed", function(response) {
                    console.log(response)
                })
                    Session.remove({ _id: req.params.sessionId }, function(err, session) {
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
                    'response':'Session not registered'
                })
            }
        })
    }
]
controller.addNewUser = [
    function(req,res) {
        var reg_id = req.body.reg_id
        Session.findById(req.params.sessionId, function(err,sessionPW){
            if(!err && sessionPW){
                if(sessionPW.password===req.body.password){
                   Session.update({_id: req.params.sessionId}, {$push: {"users": {name : req.body.name, username : req.body.username}}}, function(err, session) {
                        if (!err && session) {
                            var id = String(req.params.sessionId)
                            console.log(id)
                            request(
                        		{ method: 'PUT',
                        		uri: 'https://test-erik-boege.c9.io/users/'+reg_id,
                        		form:{"session_id" : id}
                        		}, function (error, response, body) {
                        			if(!error){
                        			    res.json({
                                            'response': "Updated Sucessfully"
                                        })
                        			}
                        	    }
                        	 )
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
        var username = req.params.username
        Session.findById(req.params.sessionId, function(err,session){
            if(!err && session){
                Session.findOne({'users.username' : username}, function (err,sessionU) {
                    if(!err && sessionU){
                        console.log("Send Request: Delete Session from user")
                        request(
                        		{ method: 'DELETE',
                        		uri: 'https://test-erik-boege.c9.io/users/'+username+"/session"
                        		}, function (error, response, body) {
                        		    console.log(body)
                        		    console.log(sessionU)
                        			if(!error){
                        			    Session.findOneAndUpdate({_id: sessionU.id}, {$pull: {users: {'username' : username}}}, function(err, sessionUp) {
                        			        console.log(err)
                        			        console.log(sessionUp)
                                            if(!err && sessionUp){
                                                res.json({
                                                    'response' : 'Updated'
                                                })
                                            } else {
                                                res.json({
                                                    'response': "Error"
                                                })
                                            }
                                        })
                        			    
                        			}
                        	    }
                        	 )
                    } else {
                         res.json({
                            'response' : 'User in Session not found'
                        })
                    }
                })
            } else {
                res.json({
                    'response' : 'Session not found'
                })
            }
        })
    }
]

controller.updateUser = [
    function(req, res) {
        var username = req.params.username
        Session.findById(req.params.sessionId, function(err,session){
            if(!err && session){
                Session.findOne({'users.username' : username}, function (err,sessionU) {
                    if(!err && sessionU){
                        console.log(sessionU)
                        Session.update({_id: sessionU.id,'users.username' : username}, {$set: {"users.$.unlocks": req.body.unlocks}}, function(err, sessionUp) {
                            if(!err && sessionUp){
                                res.json({
                                    'response' : 'Updated'
                                })
                            } else {
                                res.json({
                                    'response': "Error"
                                })
                            }
                        })
                    } else {
                         res.json({
                            'response' : 'User in Session not found'
                        })
                    }
                })
            } else {
                res.json({
                    'response' : 'Session not found'
                })
            }
        })
    }
]


module.exports = controller