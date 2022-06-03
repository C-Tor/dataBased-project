//This file contains functions used by update methods to select the correct item from a dropdown menu when on an update page. This could probably be put all into one function but screw it whatever.
function selectTeam(id){
  $("#team-selector").val(id);
}

function selectDiv(id){
  $("#div-selector").val(id);
}

function selectHomeTeam(id) {
  console.log("selecting Home team as: " + id);
  $("#home-selector").val(id);
}

function selectAwayTeam(id) {
  console.log("selecting Away team as: " + id);
  $("#away-selector").val(id);
}
