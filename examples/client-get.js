var vhttp = require('../index');
var vfs = require('vinyl-fs');
var map = require("map-stream");

var log = function(file, cb) {
  console.log(file)
  cb(null, file);
};

/*

This example will pull remote files from a vinyl-http server and write them to the local folder "./ouput"
Note: vinyl-http streams can be passed along the gulp processing chain without ever being written to file

*/

vhttp.src('test/fixtures/**', {
  uri: "http://localhost:8888/"
}).pipe(map(log)).pipe(vfs.dest('./download'));