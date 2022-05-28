function updatePlayer(id){
  $.ajax( {
    url: '/players/' + id,
    type: 'PUT',
    data: $('#update-player').serialize(),
    success: function(result){
      window.location.replace("./");
    }
  })
};
