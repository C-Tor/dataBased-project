module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getPlayerstats(res, mysql, context, complete) {
    console.log(" -- getting playerstats")
    mysql.pool.query("SELECT players.fname, players.lname, games.game_date, points, assists, rebounds FROM player_statistics JOIN games ON games.game_id = player_statistics.game_id  JOIN players ON players.player_id=player_statistics.player_id;", function (error, results, fields){
      if(error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.playerstats = results;
      complete();
    })
  }

  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getPlayerstats(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1) {
        res.render('playerstats', context);
      }
    }
  })

  return router;

}();
