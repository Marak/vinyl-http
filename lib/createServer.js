var http = require('http');
var middle = require('./middle')();

module['exports']= function createServer () {
  
  var server = http.createServer(function(req, res){
    middle(req, res);
  });
  return server;

};