var MongoModels = require('../models/models-mongo.js');
var EditorItems = MongoModels.EditorItems;
var url = '/admin/editoritems';

var commonMethods = require('../common-http-methods.js');

module.exports.controller = function(app) {
  commonMethods.addCommonMethods(app, url, EditorItems);
};