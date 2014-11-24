var express = require('express')

var routes = require('./routes')

var app = express()

app.set('x-powered-by', false);
app.get('/', routes.web.index.get)

exports = module.exports = app