var sha1 = require('sha1')

var config = require('../../config')

var User = require('mongoose').model('User')

var generateToken = function (uuid){

	return sha1(uuid+new Date().getTime())
}

var tokenWithUuid = function (tokens, token) {
	
	for (var t in tokens) {
		if (tokens[t].uuid == token) return tokens[t]
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

		var t = tokenWithUuid(usr.tokens, uuid)
		if (t){
			usr.tokens.pop(t)
		}

		var token = {uuid: uuid, token: generateToken(uuid), expires: parseInt(new Date().getTime()/1000) + config.expireToken}
		usr.tokens.push(token)
		usr.save()

		res.send(token)
	})
}

var revokeToken = function (req, res) {

	
}
var auth = {
	
	post: createToken,
	delete: revokeToken
}

module.exports = exports = auth
