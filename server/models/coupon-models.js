var mongoose = require('mongoose');
//TODO choose connect config by env
var env = process.env.NODE_ENV || 'dev';
var connStr = '';
switch (env) {
  case 'unit':
    connStr = 'mongodb://localhost:27017/msicpc';
    break;
  default:
    connStr = 'mongodb://www.sicpc.com:27017/msicpc';
    break;
}
mongoose.createConnection(connStr, function(err) {
  if (err) {
    console.log('Error is ', err);
  }
});

var Schema = mongoose.Schema;

var CouponSchema = new Schema({
  company: String,
  expire: String,
  code: String,
  info: String,
  pass: String,
  status: String
});

var UserSchema = new Schema({
  name: String,
  cardno: String,
  company: String,
  hastaken: Boolean
})

var Coupons = mongoose.model('coupons', CouponSchema);
var Users = mongoose.model('coupon-users', UserSchema);
module.exports = {
  Users: Users,
  Coupons: Coupons
}
