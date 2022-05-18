--TABLES
--divisions
--teams
--players
--player_statistics
--games

--This resets the DB, (deletes db from bottom up) not sure if this is proper
-- practice but it works and I don't get any constraint errors this way
DROP TABLE IF EXISTS player_statistics;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS divisions;

--creates all the tables

CREATE TABLE divisions (
  div_id int(11) NOT NULL AUTO_INCREMENT,
  div_name varchar(255) NOT NULL,
  PRIMARY KEY (div_id)
);

DROP TABLE IF EXISTS teams;

CREATE TABLE teams (
  team_id int(11) NOT NULL AUTO_INCREMENT,
  team_name varchar(255) NOT NULL,
  hometown varchar(255),
  div_id int(11),
  PRIMARY KEY (team_id),
  FOREIGN KEY (div_id) REFERENCES divisions (div_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

DROP TABLE IF EXISTS players;

CREATE TABLE players (
  player_id int(11) NOT NULL AUTO_INCREMENT,
  fname varchar(255),
  mname varchar(255),
  lname varchar(255) NOT NULL,
  player_number int,
  player_birthdate date,
  position varchar(255),
  team_id int(11),
  PRIMARY KEY (player_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

DROP TABLE IF EXISTS games;
CREATE TABLE games (
  game_id int(11) NOT NULL AUTO_INCREMENT,
  game_date date DEFAULT CURRENT_DATE,
  home_team int(11),
  away_team int(11),
  home_score int DEFAULT 0,
  away_score int DEFAULT 0,
  PRIMARY KEY (game_id),
  FOREIGN KEY (home_team) REFERENCES teams (team_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY (away_team) REFERENCES teams (team_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);


DROP TABLE IF EXISTS player_statistics;

CREATE TABLE player_statistics (
  player_id int(11),
  game_id int(11),
  points int DEFAULT 0,
  assists int DEFAULT 0,
  rebounds int DEFAULT 0,
  PRIMARY KEY (player_id, game_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(game_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

--insert values
INSERT INTO divisions (div_name) VALUES ('Eastern Conference'), ('Western Conference');

INSERT INTO teams (team_name, hometown, div_id) VALUES
  ('Trail Blazers', 'Portland', 2),
  ('Lakers', 'Los Angeles', 2),
  ('Rockets', 'Houston', 2),
  ('Celtics', 'Boston', 1),
  ('Bulls', 'Chicago', 1),
  ('Heat', 'Miami', 1);

/*
+---------+---------------+-------------+--------+
| team_id | team_name     | hometown    | div_id |
+---------+---------------+-------------+--------+
|       1 | Trail Blazers | Portland    |      2 |
|       2 | Lakers        | Los Angeles |      2 |
|       3 | Rockets       | Houston     |      2 |
|       4 | Celtics       | Boston      |      1 |
|       5 | Bulls         | Chicago     |      1 |
|       6 | Heat          | Miami       |      1 |
+---------+---------------+-------------+--------+

*/

-- Note apostrophes in names with \' (i think)

-- Players
INSERT INTO players (fname, lname, player_number, team_id) VALUES
  ('Damian', 'Lillard', 0, 1),
  ('Justise', 'Winslow', 26, 1),

  ('Russel', 'Westbrook', 0, 2),
  ('Anthony', 'Davis', 3, 2),

  ('David', 'Nwaba', 2, 3),
  ('Dennis', 'Schroder', 17,3),

  ('Jaylen', 'Brown', 7, 4),
  ('Marcus', 'Smart', 36, 4),

  ('Lonzo', 'Ball', 2, 5),
  ('Zach', 'LaVine', 8, 5),

  ('Kyle', 'Lowry', 7, 6),
  ('P.J.', 'Tucker', 17, 6);

-- Games
INSERT INTO games(game_date, home_team, away_team, home_score, away_score) VALUES
  ('2021-11-26', 2, 1, 118, 103),
  ('2021-12-04', 1, 4, 117, 145),
  ('2021-11-24', 3, 5, 118, 113),
  ('2021-12-31', 3, 6, 110, 120);

-- player_statistics
INSERT INTO player_statistics(player_id, game_id, points, assists, rebounds) VALUES
  (8, 2, 17, 4, 2),
  (6, 2, 31, 8, 4),
  (11, 4, 12, 3, 3),
  (5, 4, 7, 0, 10);
