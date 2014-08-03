var MongoModels = require('../models/models-mongo.js');
var TopItems = MongoModels.TopItems;
var url = '/admin/topitems';

var commonMethods = require('../common-http-methods.js');

module.exports.controller = function(app) {
  commonMethods.addCommonMethods(app, url, TopItems);
};