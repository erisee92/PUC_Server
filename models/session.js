var mongoose = require("mongoose")
var Schema = mongoose.Schema

var SessionSchema = new Schema({
    notification_key: { type: String, required: true},
    started: Boolean,
    unlocked: { user_id: String,
                count: Number
    }
})

module.exports = mongoose.model('session', SessionSchema)