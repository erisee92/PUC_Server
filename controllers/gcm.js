//Hier findet die gesammte Kommunikation mit dem Google Cloud Messaging (GCM) Service statt
var request = require("request")

//eine neue Gruppe beim GCM anlegen und Administrator hinzufügen
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

//Einen neuen Benutzer zu einer Gruppe hinzufügen
//In einer Gruppe dürfen maximal 20 Geräte sein
exports.addToGroup = function(notification_key_name,notification_key,to_id,callback) {
	console.log("add "+to_id+" to "+notification_key_name+" with key "+notification_key)
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
			if (error) throw new Error(error)
			callback(body)
		}
	 )
}

//Einen Benutzer von einer Gruppe entfernen
exports.deleteFromGroup = function(notification_key_name,notification_key,to_id,callback) {
	console.log("delete "+to_id+" from "+notification_key_name+" with key "+notification_key)
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

//eine Nachricht an eine bestimmte Gruppe senden
exports.sendMessage = function(notification_key,type,head,body,callback) {
	console.log("Send Message to "+notification_key, type, head, body)
	request(
		{ method: 'POST',
		uri: 'https://gcm-http.googleapis.com/gcm/send',
		headers: {
		    'Content-Type': 'application/json',
		    'Authorization':'key=AIzaSyCaImGQkp1hU7-tbjC7a_RNBXcF73IiEZ8'
		},
		body: JSON.stringify({
			"to" : notification_key,
			"data":{
				"msgType": type,
			    "msgHead": head,
			    "msgBody": body
			}
		})
		}, function (error, response, body) {
			if (error) throw new Error(error)
			console.log("Answer: "+body)
			callback(body)
		}
	 )
}