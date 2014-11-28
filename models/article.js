var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Article = new Schema({
   	title: String,
   	subtitle: String,
   	description: String,
   	timestamp: Number,
   	text: String,
   	imageURL: String,
   	url: String,

    beacon: String,
    location: {latitude: Number, longitude: Number},

   	stats: [{type:ObjectId, ref:'Statistic'}],
    category: {type: ObjectId, ref: 'Category'}
});

module.exports = exports = Article;