var through = require('through2');
var File = require('vinyl');

module['exports'] = function dest (glob, opt) {

  opt = opt || {
    path: './download'
  };

  var hyperquest = require('hyperquest');

  var remote = hyperquest.post(opt.uri);

  return through.obj(function(file, enc, cb){
      if (file.contents) {
        var data = {};
        data.path = file.path;
        data.contents = file.contents.toString();
        remote.write(JSON.stringify(data))
      }
      cb(null, file)
  })

};