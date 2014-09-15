var mongoose = require('mongoose');
//TODO choose connect config by env
var env = process.env.NODE_ENV || 'dev';
var connStr = '';
switch (env) {
  case 'unit':
    connStr = 'mongodb://localhost:27017/sicpc-video-unit';
    break;
  default:
    connStr = 'mongodb://www.sicpc.com:27017/msicpc';
    break;
}
mongoose.connect(connStr, function(err) {
  if (err) {
    console.log('Error is ', err);
  }
});

module.exports = mongoose;