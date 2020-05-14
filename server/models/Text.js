var mongoose = require('mongoose')

var TextSchema = new mongoose.Schema({
    id: String,
    logoId: String,
    name: String,
    fontSize: {type: Number, min: 2, max : 144},
    textColor: String,
})


module.exports = mongoose.model('Text', TextSchema);