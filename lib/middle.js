var vfs = require('vinyl-fs');
var File = require('vinyl');
var through = require('through2');
var _path = require('path');

module['exports'] = function middle (options) {
  
  options = options || {};
  options.mount = options.mount || "";
  
  return function (req, res, next) {
    var path = req.url;
    path = _path.resolve(process.cwd() + path.replace(options.mount, ""));
    //
    // Handles requests for files
    //
    // In this case, the user has called vhttp.src(glob) on the client
    // The server will respond with the glob requested on server
    if (req.method === "GET") {
      vfs.src(path)
        .pipe(through.obj(function(file, enc, cb){
          if(!file.isDirectory()) {
            var data = {};
            data.path = file.relative;
            data.contents = file.contents.toString();
            this.push(JSON.stringify(data))
          }
          cb()
        }))
        .pipe(res);
    }

    //
    // Handles file uploads
    //
    // In this case, the user has called vhttp.dest(path) on the client
    // The server will accept files from the client and write them using the vinyl-fs method, vinyldest(path)
    if (req.method === "POST") {
      req.pipe(through.obj(function(chunk, enc, cb){
        var data = chunk.toString();
        data = JSON.parse(chunk);
        var file = new File({
          path: data.path,
          contents: new Buffer(data.contents)
        });
        this.push(file);
        cb();
      })).pipe(vfs.dest('.' + req.url)).pipe(through.obj(function(file, enc, cb){
        if(!file.isDirectory()) {
          var data = {};
          data.path = file.relative;
          data.contents = file.contents.toString();
          this.push(JSON.stringify(data))
        }
        cb();
      })).pipe(res);
    }

  }

};