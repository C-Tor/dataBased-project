//main stuff

var express = require('express');
var mysql = require('./dbcon.js'); //where the database info is, inclues the mysql var call

var app = express();

app.set('port', process.argv[2]);

app.get('/', function(req, res, next) {
  res.send("Testing Testing.");
});

app.listen(app.get('port'), function () {
  console.log("Server listing on port " +app.get('port') + "Press Ctrl+C to terminate.");
})
