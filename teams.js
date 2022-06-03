module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getTeams(res, mysql, context, complete) {
    console.log(" -- getting teams")
    mysql.pool.query("SELECT teams.team_id, divisions.div_name, hometown, team_name FROM teams JOIN divisions ON teams.div_id = divisions.div_id ORDER BY teams.div_id;", function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teams = results;
      complete();
    })
  }

  //used to populate division dropdown menus (only 2 divisions I coulda just hardcoded this in)
  function getDivisions(res, mysql, context, complete){
    console.log(" -- getting divisions for teams page");
    mysql.pool.query("SELECT div_id, div_name FROM divisions;", function(error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.divisions = results;
      complete();
    });
  }

  //get team with an id, used for update team page
  function getTeam(res, mysql, context, id, complete) {
    var sql ="SELECT teams.team_id, hometown, team_name, div_id FROM teams WHERE team_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.team = results[0];
      complete();
    });
  }


  function getTeamWithNameLike(req, res, mysql, context, complete) {
    var query =
    "SELECT div_name, hometown, team_name FROM teams LEFT JOIN divisions ON teams.div_id = divisions.div_id WHERE teams.team_name LIKE " +
    mysql.pool.escape(req.params.s + "%");
    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teams = results;
      complete();
    });
  }


  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteTeam.js", "selectDrop.js", "updateteam.js", "searchAll.js"];
    var mysql = req.app.get('mysql');
    getTeams(res, mysql, context, complete);
    getDivisions(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 2) {
        res.render('teams', context);
      }
    }
  })

  router.get('/:id', function(req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteTeam.js" , "selectDrop.js", "updateteam.js", "searchAll.js"];
        var mysql = req.app.get('mysql');

        if (req.params.id === "search") {
          res.redirect("/teams");
        } else {
          getTeam(res, mysql, context, req.params.id, complete);
          getDivisions(res, mysql, context, complete);
        }

        function complete(){
            callbackCount++;
            if(callbackCount>=2) {
                res.render('updateteam', context);
            }
        }
    })

  router.post('/', function(req, res) {
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO teams (team_name, hometown, div_id) VALUES (?,?,?);";
    var inserts = [req.body.team_name, req.body.hometown, req.body.division];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      }
      res.redirect('/teams');
    });
  });


  router.get("/search/:s", function (req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [
    "deleteTeam.js" ,
    "selectDrop.js",
    "searchAll.js"];
    var mysql = req.app.get("mysql");
    errormessage = "";
    getTeamWithNameLike(req, res, mysql, context, complete);
    getDivisions(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 2) {
        res.render("teams", context);
      }
    }
  });

    router.delete("/:id", function (req, res) {
        var mysql = req.app.get("mysql");
        var sql = "DELETE FROM teams WHERE team_id = ?";
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
