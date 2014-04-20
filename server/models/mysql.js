var mysql = require('mysql');
var q = require('q');
var log = console.log;

var pool = mysql.createPool({
  host: 'localhost',
  user: 'sicpc',
  password: 'sicpc',
  database: 'jvideo'
});


exports.pool = pool;