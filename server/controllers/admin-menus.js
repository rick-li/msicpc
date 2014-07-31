var MongoModels = require('../models/models-mongo.js');
var q = require('q');
var Menus = MongoModels.Menus;
module.exports.controller = function(app) {
  app.get('/admin/menus', function(req, res, next) {
    q.nfcall(Menus.find.bind(Menus)).then(function(menus) {
      res.send(menus);
    });
  });



  app.post('/admin/menus', function(req, res, next) {
    console.log(req.body);
    res.send('User set successfully -> ');
  });
}