var request = require("request")

exports.createGroup = function(group_name,to_id,callback) {
	console.log("start request")
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
			"notification_key_name": group_name,
		  	"registration_ids" : [to_id]
		})
		}, function (error, response, body) {
			callback(body);
	    }
	 )
}

exports.addToGroup = function(group_name,notification_key,to_id,callback) {
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
			"notification_key_name": group_name,
			"notification_key": notification_key,
			"registration_ids" : [to_id]
		})
		}, function (error, response, body) {
			callback(body)
		}
	 )
}

exports.deleteFromGroup = function(group_name,notification_key,to_id,callback) {
	console.log(group_name, notification_key, to_id)
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
			"notification_key_name": group_name,
			"notification_key": notification_key,
			"registration_ids" : [to_id]
		})
		}, function (error, response, body) {
			if (error) throw new Error(error)
			callback(body)
		}
	 )
}
