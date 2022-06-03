function updateGame(id){
  $.ajax( {
    url: '/games/' + id,
    type: 'PUT',
    data: $('#update-game').serialize(),
    success: function(result){
      window.location.replace("./");
    }
  })
};
