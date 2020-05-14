var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    id: String,
    email: String,
    password: String,
})

module.exports = mongoose.model('User', UserSchema);