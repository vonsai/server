var path = require('path');

var require_old = require;

var require = function (module) {
    return require_old(path.join(__dirname, module));
};

var api = {

	auth: require('auth'),
	categories: require('categories'),
	articles: require('articles').articles,
	article: require('articles').article
}

module.exports = exports = api