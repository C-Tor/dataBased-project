function deletePlayer(player_id){
  $.ajax({
      url: '/players/' + player_id,
      type: 'DELETE',
      success: function(result){
          window.location.reload(true);
      }
  })
};
