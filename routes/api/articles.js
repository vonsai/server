var _ = require('async')

var Article = require('mongoose').model('Article'),
	Stat = require('mongoose').model('Statistic')

var getOrCreateStat = function (user, article, cb) {

	if (!article || !user) {
		
		cb(new Error("Cannot create or find stat"))
	} else {
		var st = {user: user._id, article: article._id}
		Stat.findOne(st).select("saved readingTime -_id").exec(function (err, stat) {
			
			if (err) {
				console.log(err)
				cb(err)
			} else if (stat) {
				
				cb(null, {saved: stat.saved, readingTime: stat.readingTime})
			} else {
				
				console.log("create stat")
				stat = new Stat(st)

				user.stats = user.stats || []
				article.stats = article.stats || []

				user.stats.push(stat._id)
				article.stats.push(stat._id)
				var arr = [stat.save, user.save, article.save]
				
				// TODO: Fix this. This is wrong [Issue: https://github.com/vonsai/server/issues/1]
				stat.save(function (err){
					console.log(err)
					article.save(function (err) {
						console.log(err)
						user.save(function (err){
							cb(err, stat)
						})
					})
				})
			}
		})
	}
}

var articles = {
	get: function (req, res){

		var user = req.user
		
		Article
			.find()
			.select("-__v")
			.limit(20)
			.populate("category", "name -_id")
			.populate({path:"stats", match:{user:user._id}, select:"saved readingTime -_id"})
			.sort("-timestamp")
			.exec(function (err, articles){
				_.filter(articles, function (art, cb){
						
						cb(!art.stats || art.stats.length < 1 || art.stats[0].saved != -1) //Only false when saved is -1 = is discarted

				}, function (arts){
					
					_.map(arts, function(art, cb){
						var newArt = art.toObject()
						newArt.stats = newArt.stats || []
						newArt.stats = newArt.stats[0] || {saved:0, readingTime:0, invented:true}
						cb(null, newArt)
					}, function (err, artis){
						res.send(artis)
					})
				})
			})
	},
	saved: {
		get: function(req, res){
			var user = req.user
			
			//TODO: Better do a user query [Issue: https://github.com/vonsai/server/issues/2]
			Article
				.find()
				.select("-__v")
				.limit(20)
				.populate("category", "name -_id")
				.populate({path:"stats", match:{user:user._id}, select:"saved readingTime -_id"})
				.sort("-timestamp")
				.exec(function (err, articles){
					_.filter(articles, function (art, cb){

						cb(user.stats.length > 0 && user.stats[0].saved == 1)
					
					}, function (err, articles){

						res.send(articles)
					})
				})		
		}8
	}
}

var getArticle = function (user, articleId, cb) {

	Article
		.findById(articleId)
		.select("-__v")
		.populate("category", "name -_id")
		.populate({path:"stats", match:{user:user._id}, select:"saved readingTime"})
		.exec(function (err, art) {
			if (err || !art){
				cb(err, null)
			} else if (art.stats.length < 1){
				console.log(art.stats)
				//Hack
				getOrCreateStat(user, art, function (err, stat){
					getArticle(user, articleId, cb)
				})
			} else {
				cb(null, art)
			}
		})
}
var article = {
	get: function (req, res){

		var articleId = req.params.id
		getArticle(req.user, articleId, function (err, art) {
			if (err || !art) {
				res.sendStatus(500)
			} else {
				art = art.toObject()
				art.stats = art.stats[0]
				res.send(art)
			}
		})
	},
	post: function (req, res){

		var article = req.params.id
		var stats = req.body.stats
		var user = req.user

		if (stats) {
			Stat.findOne({article: article, user: user}, function(err, stat){
				if (err || !stat){
					res.sendStatus(500)
				} else {
					if (stats.saved) { 
						stat.saved = stats.saved
						stat.savedTimestamp = parseInt(new Date().getTime()/1000) 
					}
					if (stats.readingTime) {
						stat.readingTime += stats.readingTime
					}
					stat.save(function(err){
						if (err) {
							res.sendStatus(500)
						} else {
							article.get(req, res)
						}
					})
				}
			})
		}

	}
}
module.exports = exports = {articles:articles, article: article}
