var MongoModels = require('../models/models-mongo.js');
var HomeCates = MongoModels.HomeCates;
var url = '/admin/homecates';

var commonMethods = require('../common-http-methods.js');

module.exports.controller = function(app) {
  commonMethods.addCommonMethods(app, url, HomeCates);
};