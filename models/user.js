var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    Session = require("./session.js")

var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true},
    reg_id: { type: String, required: true},
    session_id: { type: Schema.Types.ObjectId, ref: 'Session' }
})

module.exports = mongoose.model('user', UserSchema)