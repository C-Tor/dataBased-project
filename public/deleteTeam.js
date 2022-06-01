
function deleteTeam(team_id) {
    $.ajax({
        url: "/teams/" + team_id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        }
    })
};
