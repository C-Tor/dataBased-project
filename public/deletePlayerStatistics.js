function deletePlayerStatistics(player_id, game_id){
    $.ajax({
        url: '/playerstats/player_id/' + player_id + 
        '/game_id/' + game_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
  };
  