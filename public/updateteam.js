function updateTeam(id){
  $.ajax( {
    url: '/teams/' + id,
    type: 'PUT',
    data: $('#update-team').serialize(),
    success: function(result){
      window.location.replace("./");
    }
  })
};
