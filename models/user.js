//das Schema eines Users für die Datenbank
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    session = require("./session.js")

var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true},
    reg_id: { type: String, required: true},
    session_id: { type: Schema.Types.ObjectId, ref: 'session' }
})

module.exports = mongoose.model('user', UserSchema)