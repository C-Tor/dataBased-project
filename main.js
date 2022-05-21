//main stuff
var express = require('express');
var mysql = require('./dbcon.js'); //where the database info is, inclues the mysql var call
var bodyParser = require('body-parser');

// var teams = require('./teams.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});

app.engine('handlebars', handlebars.engine);
// app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.use(express.static('public'));

//deals with any /teams url
app.use('/teams', require('./teams.js'));

//deals with any /players url
app.use('/players', require('./players.js'));

app.set('port', process.argv[2]);

app.get('/', function(req, res, next) {
  res.status(200).render('home', {});
});



app.listen(app.get('port'), function () {
  console.log("Server listing on port " +app.get('port') + " Press Ctrl+C to terminate.");
});
