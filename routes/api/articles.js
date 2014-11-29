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
						newArt.id = art._id
						newArt.stats = newArt.stats || []
						newArt.stats = newArt.stats[0] || {saved:0, readingTime:0, invented:true}
						cb(null, newArt)
					}, function (err, artis){
						res.send({articles:artis})
					})
				})
			})
	},
	saved: {
		get: function(req, res){
			var user = req.user
			
			Stat
				.find({user: user._id, saved:1})
				.sort("-savedTimestamp")
				.exec(function(err, stats){
					_.map(stats, function (stat, cb) {

						getArticle(user, stat.article, function (err, art){

							art = art.toObject()
							art.id = art._id
							art.stats = art.stats || []
							art.stats = art.stats[0] || {saved:0, readingTime:0}
							cb(null, art)
						})

					}, function (err, arts) {
						console.log({articles:arts})
						res.send({articles:arts})
					})
				})
		}
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
var _article = {
	get: function (req, res){

		var articleId = req.params.id
		getArticle(req.user, articleId, function (err, art) {
			if (err || !art) {
				res.send(500, {})
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
			getArticle(user, article, function (err, art){

				Stat.findOne({article: article, user: user}, function(err, stat){
				if (err || !stat){
					console.log("no estas"+err)
					res.send(500, {})
				} else {
					if (stats.saved) { 
						stat.saved = (stats.saved) ? 1 : -1
						stat.savedTimestamp = parseInt(new Date().getTime()/1000) 
					}
					if (stats.readingTime) {
						stat.readingTime += stats.readingTime
					}
					stat.save(function(err){
						if (err) {
							console.log("err save"+err)
							res.send(500, {})
						} else {
							_article.get(req, res)
						}
					})
				}
			})
			})
		}

	}
}
module.exports = exports = {articles:articles, article: _article}
