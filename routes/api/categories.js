var Category = require('mongoose').model('Category'),
	User = require('mongoose').model('User')

var categories = {
	get: function (req, res){

		Category.find({}, function (e, cats) {
			res.send(cats)
		})
	}, 
	post: function (req, res){

		res.send('Post categories')
	}
}

module.exports = exports = categories
