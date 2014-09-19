var vhttp = require('../index');
var vfs = require('vinyl-fs');
var map = require("map-stream");

var log = function(file, cb) {
  console.log(file)
  cb(null, file);
};

vhttp.src('http://localhost:8888/test/fixtures/**')
 .pipe(map(log))
 .pipe(vhttp.dest('http://localhost:8888/upload2'));