var browserify = require('browserify');
var uglify = require('uglifyify');
var babelify = require("babelify");

var fs = require("fs");
var b = browserify({
	transform: [babelify, uglify]
});
b.add('./index.js');
b.external("react");
b.bundle().pipe(fs.createWriteStream("./dist/functional-react.js"));
