var vhttp = require('../index');
var vfs = require('vinyl-fs');
var map = require("map-stream");

var log = function(file, cb) {
  console.log(file)
  cb(null, file);
};

vfs.src('test/fixtures/**') 
.pipe(vhttp.dest('http://localhost:8888/upload'))
.pipe(map(log));
