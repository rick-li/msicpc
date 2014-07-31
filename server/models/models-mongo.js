var mongoose = require('../mongo.js');
var Schema = mongoose.Schema;

// var Item = mongoose.model('Item', {
//   name: String,
//   category: {
//     type: Schema.Types.ObjectId,
//     ref: 'Category'
//   }
// });

// var Category = mongoose.model('Category', {
//   name: String
// });
var MenuSchema = new Schema({
  name: String,
  isGroup: {type: Boolean, default: false},
  order: Number,
  group: [Object],
  image: String
});

var Menus = mongoose.model('Menus', MenuSchema);

exports.Menus = Menus;