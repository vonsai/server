var path = require('path');

var require_old = require;

var require = function (module) {
    return require_old(path.join(__dirname, module));
};

var api = {

	categories: require('categories')
}

module.exports = exports = api