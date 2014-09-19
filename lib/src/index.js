var through = require('through2');
var File = require('vinyl');
var url = require('url');
var hyperquest = require('hyperquest');

module['exports'] = function src (glob, opt) {

  opt = opt || {};

  var _url = url.parse(glob);
  var path = _url.protocol + "//" + _url.host + unescape(_url.path);

  var remote = hyperquest(path);

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