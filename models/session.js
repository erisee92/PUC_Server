var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    User = require("./user.js")

var SessionSchema = new Schema({
    notification_key: {
        type: String,
        required: true
    },
    started: Boolean,
    unlocked: {
        user_id: { type: Schema.Types.ObjectId, ref: 'Session' },
        count: Number
    }
})

module.exports = mongoose.model('session', SessionSchema)