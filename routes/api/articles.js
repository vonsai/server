var Article = require('mongoose').model('Article')

var articles = {
	get: function (req, res){

		Article
			.find()
			.select("-_id -__v")
			.limit(20)
			.populate("category", "name -_id")
			.sort("-timestamp")
			.exec(function (err, articles){
				res.send(articles)
			})
	}
}

module.exports = exports = articles