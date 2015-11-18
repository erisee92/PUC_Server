var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    user = require("./user.js")

var SessionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    notification_key: {
        type: String,
        required: true
    },
    started: Boolean,
    userCount: Number,
    unlocked: {
        user_id: { type: Schema.Types.ObjectId, ref: 'user' },
        count: Number
    }
})

module.exports = mongoose.model('session', SessionSchema)