module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getTeams(res, mysql, context, complete) {
    console.log(" -- getting teams")
    mysql.pool.query("SELECT divisions.div_name, hometown, team_name, team_id FROM teams JOIN divisions ON teams.div_id = divisions.div_id;", function (error, results, fields){
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
    getTeams(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1) {
        res.render('teams', context);
      }
    }
  })

  return router;

}();
