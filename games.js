module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getGames(res, mysql, context, complete) {
    console.log(" -- getting games")
    mysql.pool.query("SELECT game_id, h_teams.team_name AS hometeam_name, a_teams.team_name as awayteam_name, home_score, away_score, DATE_FORMAT(game_date, '%a %b %D, %Y') AS gdate FROM games JOIN teams as h_teams ON games.home_team = h_teams.team_id JOIN teams as a_teams ON games.away_team = a_teams.team_id ORDER BY game_date;", function (error, results, fields){
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

  //get game with an id, used for update game page
  function getGame(res, mysql, context, id, complete) {
    var sql ="SELECT game_id, h_teams.team_name AS hometeam_name, a_teams.team_name as awayteam_name, h_teams.team_id AS hteam_id, a_teams.team_id AS ateam_id, home_score, away_score, game_date FROM games JOIN teams as h_teams ON games.home_team = h_teams.team_id JOIN teams as a_teams ON games.away_team = a_teams.team_id WHERE game_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.game = results[0];
      complete();
    });
  }

  function getTeamWithNameLike(req, res, mysql, context, complete) {
    var query =
    "SELECT h_teams.team_name as hometeam_name, a_teams.team_name as awayteam_name, home_score, away_score, DATE_FORMAT(game_date, '%a %b %D, %Y') AS gdate FROM games INNER JOIN teams as h_teams ON h_teams.team_id = games.home_team JOIN teams as a_teams ON a_teams.team_id = games.away_team WHERE h_teams.team_name LIKE " +
    mysql.pool.escape(req.params.s + "%") +
    "OR a_teams.team_name LIKE " +
    mysql.pool.escape(req.params.s + "%");
    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.games = results;
      complete();
    });
  }

  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteGame.js" , "selectDrop.js", "searchAll.js"];
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

  router.get('/:id', function(req, res) {
    console.log(" -- Request received for update games page.")
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteGame.js" , "updategame.js", "selectDrop.js", "searchAll.js"];
    var mysql = req.app.get('mysql');

    if (req.params.id === "search") {
      res.redirect("/games");
    } else {
      getGame(res, mysql, context, req.params.id, complete);
      getTeams(res, mysql, context, complete);
    }

    function complete(){
        callbackCount++;
        if(callbackCount>=2) {
            res.render('updategame', context);
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


  router.get("/search/:s", function (req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
    "deleteGame.js" ,
    "selectDrop.js",
    "searchAll.js"];
    var mysql = req.app.get("mysql");
    errormessage = "";
    getTeamWithNameLike(req, res, mysql, context, complete);
    getTeams(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 2) {
        res.render("games", context);
      }
    }
  });


  router.delete("/:id", function (req, res) {
    var mysql = req.app.get("mysql");
    var sql = "DELETE FROM games WHERE game_id = ?";
    var inserts = [req.params.id];
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
