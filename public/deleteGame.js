
function deleteGame(game_id) {
    $.ajax({
        url: "/games/" + game_id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        }
    })
};
