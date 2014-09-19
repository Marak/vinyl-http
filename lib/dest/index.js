var through = require('through2');
var File = require('vinyl');
var url = require('url');
var hyperquest = require('hyperquest');

module['exports'] = function dest (glob, opt) {

  opt = opt || {};

  var _url = url.parse(glob);
  var path = _url.protocol + "//" + _url.host + unescape(_url.path);

  var remote = hyperquest.post(path);

  return through.obj(function(file, enc, cb){
      if (file.contents) {
        var data = {};
        data.path = file.path;
        data.contents = file.contents.toString();
        remote.write(JSON.stringify(data))
      }
      cb(null, file);
  })

};