var tap = require("tap")
  , test = tap.test
  , plan = tap.plan
  , server
  , vhttp;

test("can load `vinyl-http` module", function (t) {
  vhttp = require('../');
  t.ok(vhttp, "module loaded")
  t.end()
});