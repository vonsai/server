var Category = require('mongoose').model('Category'),
	User = require('mongoose').model('User')

var categories = {
	get: function (req, res){

		var categories = []
		var preferences = req.user.preferences

		for (var i = 0; i<preferences.length; i++) {
			var pref = preferences[i]

			if (pref) categories.push({id: pref.category._id, name: pref.category.name, value: pref.value})
		}

		res.send({categories:categories})
	}, 
	post: function (req, res){

		res.send([])
	}
}

module.exports = exports = categories
