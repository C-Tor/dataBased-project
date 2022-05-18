
-- Teams
--View teams
SELECT team_id, hometown, team_name, div_id FROM teams ORDER BY div_id;

--Add team
INSERT INTO teams (team_id, hometown, team_name, div_id) VALUES (:team_id_Input, :hometownInput, :team_name_Input, :div_id_Input);

--Update Team

--Delete Team via ID


-- Players
--View players (maybe use team_id to get team name)

--Add player

--Update player

--Delete player via ID


-- Games
--view games (sort by date?)

--Add Game

--Update Games

--Delete Game


-- PLayer Statistics
--view player stats (per game)

--Add player statistic

--Update player statistic

--Delete player statistic
