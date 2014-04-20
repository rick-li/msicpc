var mongoose = require('../mongo.js');
var Item = mongoose.model('Item', {
  name: String,
})