// replace user, password, and database values with your database username and password. Then, remove the _example in the file name to make it just dbcon.js
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_yourusername',
  password        : '1234',
  database        : 'cs340_yourusername'
});
module.exports.pool = pool;
