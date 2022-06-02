function searchPlayer() {
  
  var last_name_search_string = document.getElementById("last_name_search_string").value;

  window.location = "/players/search/" + encodeURI(last_name_search_string);
}

function searchTeam() {
  
  var team_name_search_string = document.getElementById("team_name_search_string").value;

  window.location = "/teams/search/" + encodeURI(team_name_search_string);
}

function searchGame() {
  
  var game_search_string = document.getElementById("game_search_string").value;

  window.location = "/games/search/" + encodeURI(game_search_string);
}

function searchPlayerStatistics() {
  
  var last_name_search_string = document.getElementById("last_name_search_string").value;

  window.location = "/playerstats/search/" + encodeURI(last_name_search_string);
}

