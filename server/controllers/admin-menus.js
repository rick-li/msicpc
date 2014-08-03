var MongoModels = require('../models/models-mongo.js');
var Menus = MongoModels.Menus;
var url = '/admin/menus';

var commonMethods = require('../common-http-methods.js');

module.exports.controller = function(app) {
  commonMethods.addCommonMethods(app, url, Menus);
};