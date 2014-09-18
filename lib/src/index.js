var through = require('through2');
var File = require('vinyl');
var hyperquest = require('hyperquest');

module['exports'] = function src (glob, opt) {

  opt = opt || {
    uri: 'http://localhost:8888/'
  };

  var remote = hyperquest(opt.uri + glob);

  return remote
    .pipe(through.obj(function(chunk, enc, cb){
      var data = chunk.toString();
      data = JSON.parse(chunk);
      var file = new File({
        path: data.path,
        contents: new Buffer(data.contents)
      });
      this.push(file);
      cb();
    }));

};