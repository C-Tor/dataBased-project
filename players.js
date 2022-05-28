module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getPlayers(res, mysql, context, complete) {
    console.log(" -- getting players")
    mysql.pool.query("SELECT players.player_id, teams.team_name, players.fname, players.lname, players.player_number, DATE_FORMAT(players.player_birthdate, '%b %D, %Y') AS birth_date, players.position FROM players INNER JOIN teams ON players.team_id = teams.team_id ORDER BY teams.team_name;", function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.players = results;
      complete();
    });
  }

  //used to populate team dropdown menus
  function getTeams(res, mysql, context, complete){
    console.log(" -- getting teams for player page");
    mysql.pool.query("SELECT team_id as id, team_name FROM teams;", function(error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teams = results;
      complete();
    })
  }

  //get player with an id, used for update player page
  function getPlayer(res, mysql, context, id, complete) {
    var sql ="SELECT player_id, fname, mname, lname, player_number AS number, player_birthdate, position, team_id FROM players WHERE player_id = ?"
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.player = results[0];
      complete();
    });
  }
  //gets the page for /players
  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getPlayers(res, mysql, context, complete);
    getTeams(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 2) {
        res.render('players', context);
      }
    }
  })

  router.get('/:id', function(req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateplayer.js", "selectDrop.js"];
    var mysql = req.app.get('mysql');
    getPlayer(res, mysql, context, req.params.id, complete);
    getTeams(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount>=2) {
        res.render('updateplayer', context);
      }
    }
  })

  //handles post requests (inserting data)
  router.post('/', function(req, res) {
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO players (fname, mname, lname, team_id, player_number, player_birthdate, position) VALUES (?,?,?,?,?,?,?);";
    var inserts = [req.body.fname, req.body.mname, req.body.lname, req.body.team, req.body.number, req.body.birthdate, req.body.position];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      }
      res.redirect('/players');
    });
  });

  return router;

}();
