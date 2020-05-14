var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
    id: String,
    logoID: String,
    url: Stirng
});

module.exports = mongoose.model('Image', ImageSchema);