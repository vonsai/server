var index = function (req, res) {

	res.send("Hello world")
}

var web = {

	index: {
		get: index
	}
}

module.exports = exports = web