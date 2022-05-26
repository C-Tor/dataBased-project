module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getPlayers(res, mysql, context, complete) {
    console.log(" -- getting players")
    mysql.pool.query("SELECT teams.team_name, players.fname, players.lname, players.player_number, players.player_birthdate, players.position FROM players INNER JOIN teams ON players.team_id = teams.team_id;", function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.players = results;
      complete();
    })
  }

  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getPlayers(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1) {
        res.render('players', context);
      }
    }
  })

  return router;

}();
