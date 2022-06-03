function updatePlayerstat(pid, gid){
  $.ajax( {
    url: '/playerstats' + '/player_id/' + pid + '/game_id/' + gid,
    type: 'PUT',
    data: $('#update-playerstat').serialize(),
    success: function(result){
      window.location.replace("/playerstats");
    }
  })
};
