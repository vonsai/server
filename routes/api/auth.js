var sha1 = require('sha1')

var config = require('../../config')

var User = require('mongoose').model('User')

var generateToken = function (uuid){

	return sha1(uuid+new Date().getTime())
}

var tokenWithX = function (x, tokens, xx) {
	
	for (var t in tokens) {
		if (tokens[t][x] == xx) return tokens[t]
	}
	return null
}
var createToken = function (req, res) {

	var uuid = req.body.uuid
	User.findOne({uuids: uuid}, function (err, usr) {

		if (!usr) {
			//Register user
			usr = new User({uuids: [uuid]})
			usr.setupCategories()
		}

		var t = tokenWithX('uuid', usr.tokens, uuid)
		if (t){
			usr.tokens.pop(t)
		}

		var token = {uuid: uuid, token: generateToken(uuid), expires: parseInt(new Date().getTime()/1000) + config.expireToken}
		usr.tokens.push(token)
		usr.save(function (err){
			if (err) res.send(500, {})
			else res.send({token:token, accountTokens:usr.tokens.length, hasSetCategories: usr.hasSetCategories})
		})
	})
}

var revokeToken = function (req, res) {

	var user = req.user
	user.tokens.pop(tokenWithX('token', user.tokens, req.get('X-Api-Token')))
	user.save(function(err){
		res.send((err) ? 500 : 200, {})
	})
}
var auth = {
	
	post: createToken,
	delete: revokeToken
}

module.exports = exports = auth
