var mysql = require('mysql');
var q = require('q');
var log = console.log;

var pool = mysql.createPool({
  host: 'localhost',
  user: 'jvideo',
  password: 'vwrite',
  database: 'jvideo'
});


exports.pool = pool;
