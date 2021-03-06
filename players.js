module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getPlayers(res, mysql, context, complete) {
    console.log(" -- getting players")
    mysql.pool.query("SELECT players.player_id, teams.team_name, players.fname, players.lname, players.player_number, DATE_FORMAT(players.player_birthdate, '%b %D, %Y') AS birth_date, players.position FROM players LEFT JOIN teams ON players.team_id = teams.team_id ORDER BY teams.team_id;", function (error, results, fields){
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
    var sql ="SELECT player_id, fname, mname, lname, player_number AS number, player_birthdate, DATE_FORMAT(player_birthdate, '%Y-%m-%d') AS p_birthday, position, team_id FROM players WHERE player_id = ?";
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


  function getPeopleWithNameLike(req, res, mysql, context, complete) {
    var query =
    "SELECT team_name, fname, lname, player_number, DATE_FORMAT(player_birthdate, '%b %D, %Y') AS birth_date, position FROM players LEFT JOIN teams ON players.team_id = teams.team_id WHERE players.lname LIKE " +
    mysql.pool.escape(req.params.s + "%");
    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.players = results;
      complete();
    });
  }


  //gets the page for /players
  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletePlayer.js","updateplayer.js","selectDrop.js", "searchAll.js"];
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
    context.jsscripts = ["deletePlayer.js" , "updateplayer.js", "selectDrop.js", "searchAll.js"];
    var mysql = req.app.get('mysql');

    if (req.params.id === "search") {
      res.redirect("/players");
    } else {
      getPlayer(res, mysql, context, req.params.id, complete);
      getTeams(res, mysql, context, complete);
    }
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
        console.log(error.sqlMessage);
        res.redirect('/players');
        // res.write(JSON.stringify(error));
        // res.end();
      } else
      res.redirect('/players');
    });
  });


  router.get("/search/:s", function (req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
    "deletePlayer.js" ,
    "selectDrop.js",
    "searchAll.js"];
    var mysql = req.app.get("mysql");
    errormessage = "";
    getPeopleWithNameLike(req, res, mysql, context, complete);
    getTeams(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 2) {
        res.render("players", context);
      }
    }
  });

  router.put('/:id', function(req, res) {
    console.log(" -- received PUT request for /players/" + req.params.id);
    var mysql = req.app.get('mysql');
    var sql = "UPDATE players SET fname=?, mname=?, lname=?, team_id=?, player_number=?, player_birthdate=?, position=? WHERE player_id=?;";
    var inserts = [req.body.fname, req.body.mname, req.body.lname, req.body.team, req.body.number, req.body.birthdate, req.body.position, req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if (error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      }
      res.status(200);
      res.end();
    })
  });

    router.delete("/:id", function (req, res) {
        var mysql = req.app.get("mysql");
        var sql = "DELETE FROM players WHERE player_id = ?";
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
