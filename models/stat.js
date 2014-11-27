var mongoose = require('mongoose'),
	_ = require('async')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Stat = new Schema({

	article: {type:ObjectId, ref:'Article'},
	user: {type:ObjectId, ref:'User'},

	saved: {type: Number, default:0}, // 0 = unset, 1 = saved, -1 = discarted
	savedTime: {type: Number, default:0},
	readingTime: {type: Number, default:0}
})

module.exports = exports = Stat