var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    user = require("./user.js")

var SessionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    notification_key_name: {
        type: String,
        required: true
    },
    notification_key: {
        type: String,
        required: true
    },
    started: Boolean,
    admin: {
        type: String,
        required: true    
    },
    users: [{
        name: String
    }]
})

module.exports = mongoose.model('session', SessionSchema)