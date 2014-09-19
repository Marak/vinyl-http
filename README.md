# vinyl-http

## Unreleased v0.0.0

## Information

<table>
<tr>
<td>Package</td><td>vinyl-http</td>
</tr>
<tr>
<td>Description</td>
<td>Vinyl adapter for HTTP</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Purpose

This vinyl adapter allows you to either either post or receive streams of vinyl from an HTTP server.

This enables the ability to quickly push or retrieve streams of files to or from remote sources.

An HTTP server component is require and shipped with this module, it can be used as a stand-alone server or as middleware for your existing http server.

Alternatives to using this module could be `gulp-sftp`, but that would necessitate an open ssh server while `vinyl-http` requires only an open http server.

## Usage

### Start the server

```javascript
var server = require('vinyl-http').createServer();
server.listen(8888);
```

### Push locale to remote

```javascript
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

```

### Pull remote to local

```javascript
var vhttp = require('../index');
var vfs = require('vinyl-fs');
var map = require("map-stream");

var log = function(file, cb) {
  console.log(file)
  cb(null, file);
};

vhttp.src('http://localhost:8888/test/fixtures/**')
 .pipe(map(log))
 .pipe(vfs.dest('./download'));

```

### Stream from remote to remote

```javascript
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

```

## API

### src(globs[, opt])

- Takes a glob string or an array of glob strings as the first argument.
- Returns a Readable/Writable stream.
- On write the stream will simply pass items through.
- This stream emits matching [vinyl] File objects

### watch(globs[, opt, cb])

As of `v0.0.0`, not implemented yet.

### dest(folder[, opt])

- Takes a folder path as the first argument.
- Possible options for the second argument:
- Returns a Readable/Writable stream.

## TODO
  - Add Tests
  - Investigate adding compression
  - Investigate implementing watch method
  - Add protection for directory traversals on server