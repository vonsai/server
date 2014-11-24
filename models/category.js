var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Category = new Schema({
   	name: String,
    feedURL: String,
    lastBuilt: {type: Number, default: 0}
});

module.exports = exports = Category;