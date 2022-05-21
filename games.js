module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getGames(res, mysql, context, complete) {
    console.log(" -- getting games")
    mysql.pool.query("SELECT game_id, home_team, away_team, home_score, away_score, game_date FROM games ORDER BY game_date;", function (error, results, fields){
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
    var mysql = req.app.get('mysql');
    getGames(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1) {
        res.render('games', context);
      }
    }
  })

  return router;

}();
