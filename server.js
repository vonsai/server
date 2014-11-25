var express = require('express'),
	bodyParser = require('body-parser')

var routes = require('./routes'),
	middleware = require('./middleware')

exports = module.exports = function() {

	var app = express()

	app.set('x-powered-by', false);

	app.route('/')
		.get(routes.web.index.get)

	app.use('/api/*', bodyParser.json(), middleware.jsonResponse)
	app.use('/api/*', middleware.signatureRequired)

	app.route('/api/auth')
		.post(routes.api.auth.post)
		.delete(routes.api.auth.delete)

	app.route('/api/categories')
		.all(middleware.tokenRequired)
		.get(routes.api.categories.get)
		.post(routes.api.categories.post)

	return app
}