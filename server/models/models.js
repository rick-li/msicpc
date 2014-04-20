var mongoose = require('../mongo.js');
var Schema = mongoose.Schema;

var Item = mongoose.model('Item', {
  name: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }
});

var Category = mongoose.model('Category', {
  name: String
});

var Menu = mongoose.model('Menu', {
  name: String
});

exports.Item = Item;
exports.Category = Category;