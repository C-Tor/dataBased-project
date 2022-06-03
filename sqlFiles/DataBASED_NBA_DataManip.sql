
-- Teams
-- View teams
SELECT teams.team_id, divisions.div_name, hometown, team_name FROM teams JOIN divisions ON teams.div_id = divisions.div_id ORDER BY teams.div_id;

-- Add team
INSERT INTO teams (team_id, hometown, team_name, div_id) VALUES (:team_id_Input, :hometownInput, :team_name_Input, :div_id_Input);

-- Update Team
UPDATE teams SET team_name = :team_nameInput, wins = :winsInput, losses = :lossesInput, hometown = :hometownInput WHERE team_id= :team_id_selected;

-- Delete Team via ID
DELETE FROM teams WHERE team_id = :team_id_to_delete;

-- Players
-- View players (maybe use team_id to get team name)
SELECT players.player_id, teams.team_name, players.fname, players.lname, players.player_number, DATE_FORMAT(players.player_birthdate, '%b %D, %Y') AS birth_date, players.position FROM players LEFT JOIN teams ON players.team_id = teams.team_id ORDER BY teams.team_id;

-- Add player
INSERT INTO players (fname, mname, lname, player_number, player_birthdate, position) VALUES (:player_fnameInput, :player_mnameInput, :player_lnameInput, :player_numberInput, :player_birthdayInput, :player_positionInput)

-- Update player
UPDATE players SET fname = :fname_Input, mname = :mname_Input, lname = :lname_Input, player_number = :player_numberInput, player_birthday = :player_birthdayInput, player_position = :player_positionInput WHERE player_id= :player_id_selected;

-- Delete player via ID
DELETE FROM players WHERE players_id = :player_id_selected;

-- Games
-- view games (sort by date?)
SELECT game_id, h_teams.team_name AS hometeam_name, a_teams.team_name as awayteam_name, home_score, away_score, DATE_FORMAT(game_date, '%a %b %D, %Y') AS gdate FROM games JOIN teams as h_teams ON games.home_team = h_teams.team_id JOIN teams as a_teams ON games.away_team = a_teams.team_id ORDER BY game_date;

-- Add Game
INSERT INTO games (home_team, away_team, away_score, home_score, game_date) VALUES (:home_teamInput, :away_teamInput, :away_scoreInput, :home_scoreInput, :game_dateInput)
-- Update Games
UPDATE games SET home_team = :home_teameInput, away_team = :away_teamInput, away_score = :away_scoreInput, home_score = :home_scoreInput, game_date = :game_dateInput WHERE game_id = :game_id_selected
-- Delete Game
DELETE FROM games WHERE game_id = :game_id_to_delete

-- PLayer Statistics
-- view all player stats
SELECT player_statistics.player_id, player_statistics.game_id, players.fname, players.lname, DATE_FORMAT(games.game_date, '%a %b %D, %Y') AS gdate, points, assists, rebounds FROM player_statistics JOIN games ON games.game_id = player_statistics.game_id  JOIN players ON players.player_id=player_statistics.player_id;

-- Add player statistic
INSERT INTO player_statistics (player_id, game_id, points, assists, rebounds) VALUES (:player_ID_selected, :game_id_selected, :pointsInput, :assistsInput, :reboundsInput)
-- Update player statistic
UPDATE player_statistics SET player_id = :player_id_selected, game_id = :game_id_selected, points = :pointsInput, assists = :assistsInput, rebounds = :reboundsInput WHERE game_id = :game_id_selected AND player_id = player_id_selected
-- Delete player statistic
DELETE FROM player_statistics WHERE player_id = :player_ID_selected AND game_id = :game_ID_selected
