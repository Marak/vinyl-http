var vhttp = require('../index');
var vfs = require('vinyl-fs');
var map = require("map-stream");
var through = require('through2');
var File = require('vinyl');

var log = function(file, cb) {
  console.log(file)
  cb(null, file);
};

// in this case the files come back as expected format
vfs.src('test/fixtures/**') 
.pipe(vhttp.dest('/upload', {
  uri: "http://localhost:8888/"
}))
.pipe(map(log))

