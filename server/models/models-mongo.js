var mongoose = require('../mongo.js');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
  name: String,
  isGroup: {type: Boolean, default: false},
  order: Number,
  categories: {type: [{id: String, name: String}], default: []},
  group: Object,
  child: Array,
  image: {type: String, default: ''}
});
var Menus = mongoose.model('Menus', MenuSchema);
exports.Menus = Menus;


var TopItemsSchema = new Schema({
  name: String,
  data: Object,
  itemId: String,
  order: Number,
  image: {type: String, default: ''}
});
var TopItems = mongoose.model('TopItems', TopItemsSchema);
exports.TopItems = TopItems;


var EditorItemsSchema = new Schema({
  name: String,
  data: Object,
  itemId: String,
  order: Number,
  image: {type: String, default: ''}
});
var EditorItems = mongoose.model('EditorItems', EditorItemsSchema);
exports.EditorItems = EditorItems;

var HomeCatesSchema = new Schema({
  name: String,
  order: Number,
  categories: {type: [{id: String, name: String}], default: []},
  image: {type: String, default: ''}
});
var HomeCates = mongoose.model('HomeCates', HomeCatesSchema);
exports.HomeCates = HomeCates;