'use strict';
var Proxy = require('gulp-connect-proxy');
var gulp = require('gulp');

module.exports = function(options) {
	gulp.task('connect', function () {
		connect.server({
			root: [conf.dist],
			port: 9000,
			livereload: true,
			middleware: function (connect, opt) {
				opt.route = '/proxy';
				var proxy = new Proxy(opt);
				return [proxy];
			}
		});
	});
};