module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getPlayerstats(res, mysql, context, complete) {
    console.log(" -- getting players")
    mysql.pool.query("SELECT player_id, game_id, points, assists, rebounds FROM player_statistics ORDER BY player_id;", function (error, results, fields){
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
