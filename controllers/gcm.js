var request = require("request")

exports.createGroup = function(notification_key_name,to_id,callback) {
	console.log("start request")
	console.log(notification_key_name)
	console.log(to_id)
	request(
		{ method: 'POST',
		uri: 'https://android.googleapis.com/gcm/notification',
		headers: {
		    'Content-Type': 'application/json',
		    'Authorization':'key=AIzaSyCaImGQkp1hU7-tbjC7a_RNBXcF73IiEZ8',
		    'project_id':'142896340334'
		},
		body: JSON.stringify({
			"operation" : "create",
			"notification_key_name": notification_key_name,
		  	"registration_ids" : [to_id]
		})
		}, function (error, response, body) {
			callback(body);
	    }
	 )
}

exports.addToGroup = function(notification_key_name,notification_key,to_id,callback) {
	request(
		{ method: 'POST',
		uri: 'https://android.googleapis.com/gcm/notification',
		headers: {
		    'Content-Type': 'application/json',
		    'Authorization':'key=AIzaSyCaImGQkp1hU7-tbjC7a_RNBXcF73IiEZ8',
		    'project_id':'142896340334'
		},
		body: JSON.stringify({
			"operation" : "add",
			"notification_key_name": notification_key_name,
			"notification_key": notification_key,
			"registration_ids" : [to_id]
		})
		}, function (error, response, body) {
			callback(body)
		}
	 )
}

exports.deleteFromGroup = function(notification_key_name,notification_key,to_id,callback) {
	console.log(notification_key_name, notification_key, to_id)
	request(
		{ method: 'POST',
		uri: 'https://android.googleapis.com/gcm/notification',
		headers: {
		    'Content-Type': 'application/json',
		    'Authorization':'key=AIzaSyCaImGQkp1hU7-tbjC7a_RNBXcF73IiEZ8',
		    'project_id':'142896340334'
		},
		body: JSON.stringify({
			"operation" : "remove",
			"notification_key_name": notification_key_name,
			"notification_key": notification_key,
			"registration_ids" : [to_id]
		})
		}, function (error, response, body) {
			if (error) throw new Error(error)
			callback(body)
		}
	 )
}

exports.sendMessage = function(notification_key,type,message,callback) {
	console.log(notification_key, message)
	request(
		{ method: 'POST',
		uri: 'https://gcm-http.googleapis.com/gcm/send',
		headers: {
		    'Content-Type': 'application/json',
		    'Authorization':'key=AIzaSyCaImGQkp1hU7-tbjC7a_RNBXcF73IiEZ8'
		},
		body: JSON.stringify({
			"to" : notification_key,
			"data":{"msgType": type,
					"body": message
			}
		})
		}, function (error, response, body) {
			if (error) throw new Error(error)
			callback(body)
		}
	 )
}