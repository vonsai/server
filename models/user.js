var mongoose = require('mongoose'),
	_ = require('async')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var User = new Schema({
	uuids: [String],
   	tokens: [{uuid: String, token: String, expires: Number}],
   	preferences: [{category: {type: ObjectId, ref: 'Category'}, value: Number}] 
});

User.methods.setupCategories = function (callback) {

	var user = this
	mongoose.model('Category').find({}, function (err, cats){
		if (!err){
			_.each(cats, function(cat, cb){

				user.preferences.push({category:cat._id, value: 0.5})
				cb()

			}, function (err){
				user.save(callback)
			})
		}
	})
}

module.exports = exports = User;