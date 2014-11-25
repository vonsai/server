var express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan')

var routes = require('./routes'),
	middleware = require('./middleware')

exports = module.exports = function() {

	var app = express()

	app.set('x-powered-by', false);
	app.use(logger('combined'))

	app.route('/')
		.get(routes.web.index.get)

	app.use('/api/*', bodyParser.json(), middleware.jsonResponse)
	//app.use('/api/*', middleware.signatureRequired)

	app.route('/api/auth')
		.post(routes.api.auth.post)
		.delete(middleware.tokenRequired, routes.api.auth.delete)

	app.route('/api/categories')
		.all(middleware.tokenRequired)
		.get(routes.api.categories.get)
		.post(routes.api.categories.post)

	app.route('/api/articles')
		.all(middleware.tokenRequired)
		.get(routes.api.articles.get)

	return app
}