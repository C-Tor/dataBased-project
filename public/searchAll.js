function searchPlayer() {
  
  var last_name_search_string = document.getElementById("last_name_search_string").value;

  window.location = "/players/search/" + encodeURI(last_name_search_string);
}
