module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getPlayerstats(res, mysql, context, complete) {
    console.log(" -- getting playerstats")
    mysql.pool.query("SELECT player_statistics.player_id, player_statistics.game_id, players.fname, players.lname, games.game_date, points, assists, rebounds FROM player_statistics JOIN games ON games.game_id = player_statistics.game_id  JOIN players ON players.player_id=player_statistics.player_id;", function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.playerstats = results;
      complete();
    })
  }

  function getPlayers(res, mysql, context, complete) {
    console.log(" -- getting players for playerstats")
    mysql.pool.query("SELECT teams.team_name, players.fname as pfname, players.lname as plname, players.player_number, players.player_birthdate, players.position, players.player_id as player_id FROM players INNER JOIN teams ON players.team_id = teams.team_id ORDER BY teams.team_name;", function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.players = results;
      complete();
    });
  }

  function getGames(res, mysql, context, complete) {
    console.log(" -- getting games for playerstats")
    mysql.pool.query("SELECT game_id, h_teams.team_name AS hometeam_name, a_teams.team_name as awayteam_name, home_score, away_score, DATE_FORMAT(game_date, '%a %b %D, %Y') AS gdate FROM games JOIN teams as h_teams ON games.home_team = h_teams.team_id JOIN teams as a_teams ON games.away_team = a_teams.team_id ORDER BY game_date;", function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.games = results;
      complete();
    })
  }

  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletePlayerStatistics.js" , "selectDrop.js"];
    var mysql = req.app.get('mysql');
    getPlayerstats(res, mysql, context, complete);
    getPlayers(res, mysql, context, complete);
    getGames(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 3) {
        res.render('playerstats', context);
      }
    }
  })


  router.get('/:id', function(req, res) {
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletePlayerStatistics.js" , "selectDrop.js"];
    var mysql = req.app.get('mysql');
    getTeams(res, mysql, context, req.params.id, complete);
    getDivisions(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount>=3) {
            res.render('playerstats', context);
        }
    }
})


  router.post('/', function(req, res) {
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO player_statistics (player_id, game_id, points, assists, rebounds) VALUES (?,?,?,?,?);";
    var inserts = [req.body.player, req.body.game, req.body.points, req.body.assists, req.body.rebounds];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      }
      res.redirect('/playerstats');
    });
  });


  router.delete("/player_id/:player_id/game_id/:game_id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql = "DELETE FROM player_statistics WHERE player_id = ? AND game_id = ?;";
    var inserts = [req.params.player_id, req.params.game_id];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            res.status(202).end();
        }
    });
});

  return router;

}();
