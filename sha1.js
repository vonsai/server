var crypto = require('crypto')

var SALT = 'showy:)^^'

function sha1(s){

	var sha = crypto.createHash('sha1');
	sha.update(s)
	return sha.digest('hex')
}


exports.sha1 = function (s){

	return sha1(s)
}
exports.sha1salted = function (s){

	one = sha1(s)
	two = SALT+one+SALT
	return sha1(two)

}