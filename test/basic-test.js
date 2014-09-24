var tap = require("tap")
  , test = tap.test
  , plan = tap.plan
  , server
  , vhttp;

var through = require('through2');
var vfs = require('vinyl-fs');

var rimraf = require('rimraf');
var path = require('path');

// remove /upload and /download directories for test
var uploadPath = path.resolve(__dirname + "/../upload");
var uploadPath2 = path.resolve(__dirname + "/../upload2");
rimraf.sync(uploadPath)
rimraf.sync(uploadPath2)

test("can load `vinyl-http` module", function (t) {
  vhttp = require('../');
  t.ok(vhttp, "module loaded")
  t.end()
});

test("can start `vinyl-http` server", function (t) {
  server = vhttp.createServer().listen(8888, function(){
    t.ok(vhttp, "module loaded")
    t.end()
  });
});

test("can pull vinyl from http server", function (t) {

  var files = {};
  vhttp.src('http://localhost:8888/test/fixtures/**')
   .pipe(through.obj(function(file, enc, cb){
     files[file.relative] = file;
     cb(null, file)
   }, function (cb) {
     t.equal(Object.keys(files).length, 5);
     t.type(files['a.js'], "object")
     t.type(files['b.js'], "object")
     t.type(files['f.js'], "object")
     t.type(files['folder/c.js'], "object")
     t.type(files['folder/d.js'], "object")

     t.end();
     cb();
   }))
  // .pipe(vfs.dest('./download'));
});

test("can push vinyl to http server", function (t) {


  vfs.src('test/fixtures/**')
     .pipe(vhttp.dest('http://localhost:8888/upload'))
     .pipe(through.obj(function(file, enc, cb){
       cb(null, file);
     }, function(cb){
       // TODO: There seems to be an issue with uploads not being ready locally immediately ater pushing
       // could be an issue with inproper stream handling or just test enviroment issue since code is a testing remote upload locally
       setTimeout(function(){
          var files = {};
            vfs.src('upload/test/fixtures/**')
              .pipe(through.obj(function(file, enc, cb){
                if(!file.isDirectory()) {
                  files[file.relative] = file;
                }
                cb(null, file);
              }, function(cb){
                t.equal(Object.keys(files).length, 5);
                 t.type(files['a.js'], "object");
                 t.type(files['b.js'], "object");
                 t.type(files['f.js'], "object");
                 t.type(files['folder/c.js'], "object");
                 t.type(files['folder/d.js'], "object");
                 cb();
                 t.end();
              }));
       }, 50);

     }));

});

test("can stream vinyl from http server to http server", function (t) {
  var files = {};

  vhttp.src('http://localhost:8888/test/fixtures/**')
   .pipe(vhttp.dest('http://localhost:8888/upload2'))
   .pipe(through.obj(function(file, enc, cb){
     cb(null, file)
   }, function (cb) {
        var files = {};
          vfs.src('upload2/**')
            .pipe(through.obj(function(file, enc, cb){
              if(!file.isDirectory()) {
                files[file.relative] = file;
              }
              cb(null, file);
            }, function(cb){
               t.equal(Object.keys(files).length, 5);
               t.type(files['a.js'], "object");
               t.type(files['b.js'], "object");
               t.type(files['f.js'], "object");
               t.type(files['folder/c.js'], "object");
               t.type(files['folder/d.js'], "object");
               cb();
               t.end();
            }));

     t.end();
     cb();
   }));
});

test("can close `vinyl-http` server", function (t) {
  server.close(function(){
    t.ok(vhttp, "server shut down")
    t.end()
  });
});