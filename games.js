module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getGames(res, mysql, context, complete) {
    console.log(" -- getting games")
    mysql.pool.query("SELECT game_id, h_teams.team_name AS hometeam_name, a_teams.team_name as awayteam_name, home_score, away_score, game_date FROM games JOIN teams as h_teams ON games.home_team = h_teams.team_id JOIN teams as a_teams ON games.away_team = a_teams.team_id ORDER BY game_date;", function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.games = results;
      complete();
    })
  }

  //used to populate the teams dropdown menu
  function getTeams(res, mysql, context, complete){
    console.log(" -- getting teams for games page");
    mysql.pool.query("SELECT team_id as id, team_name FROM teams;", function(error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teams = results;
      complete();
    })
  }

  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getGames(res, mysql, context, complete);
    getTeams(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 2) {
        res.render('games', context);
      }
    }
  })

  router.post('/', function(req, res) {
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO games (game_date, home_team, away_team, home_score, away_score) VALUES (?,?,?,?,?);";
    var inserts = [req.body.gamedate, req.body.hometeam, req.body.awayteam, req.body.homescore, req.body.awayscore];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
      if(error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      }
      res.redirect('/games');
    })
  })

  return router;

}();
