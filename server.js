var express = require('express')

var routes = require('./routes')

exports = module.exports = function() {

	var app = express()

	app.set('x-powered-by', false);

	app.route('/')
		.get(routes.web.index.get)
		
	app.route('/api/categories')
		.get(routes.api.categories.get)
		.post(routes.api.categories.post)

	return app
}