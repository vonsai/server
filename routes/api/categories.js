var Category = require('mongoose').model('Category')

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

		var categories = req.body.categories

		if (!categories){
			res.sendStatus(405)
		} else {

			var catObject = {}
			for (var i = 0; i<categories.length; i++){
				var c = categories[i]

				catObject[c.id] = c.value
			}

			var user = req.user
			var preferences = user.preferences,
				newPreferences = []

			for (var i = 0; i<preferences.length; i++) {

				var pref = {category: preferences[i].category._id, value: preferences[i].value}
				var value = catObject[pref.category]
				if (typeof value === "number") pref.value = value
				newPreferences.push(pref)
			}
			user.preferences = newPreferences
			user.hasSetCategories = true
			user.save(function (err) {
				if (err) {
					console.log(err)
					res.sendStatus(500)
				} else {
					res.sendStatus(200)
				}
			})

		}
	}
}

module.exports = exports = categories
