var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    user = require("./user.js")

var SessionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    passwort: String,
    notification_key: {
        type: String,
        required: true
    },
    started: Boolean
})

module.exports = mongoose.model('session', SessionSchema)