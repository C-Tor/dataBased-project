module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getTeams(res, mysql, context, complete) {
    console.log(" -- getting teams")
    mysql.pool.query("SELECT divisions.div_name, hometown, team_name FROM teams JOIN divisions ON teams.div_id = divisions.div_id ORDER BY teams.div_id;", function (error, results, fields){
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
    mysql.pool.query("SELECT div_id as id, div_name FROM divisions;", function(error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.divisions = results;
      complete();
    })
  }

  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
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

  return router;

}();
