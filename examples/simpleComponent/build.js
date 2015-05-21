var browserify = require('browserify');
var uglify = require('uglifyify');
var babelify = require("babelify");

var fs = require("fs");
var b = browserify({
	transform: [babelify, uglify]
});
b.add('./Page.js');
b.bundle().pipe(fs.createWriteStream("./dist/page.js"));
