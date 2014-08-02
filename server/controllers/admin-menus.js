var mongoose = require('mongoose');
var MongoModels = require('../models/models-mongo.js');
var q = require('q');
var Menus = MongoModels.Menus;
module.exports.controller = function(app) {
  app.get('/admin/menus', function(req, res, next) {
    var queryMenus = function() {
      var defer = q.defer();
      Menus.find().sort('order').exec(function(err, menus) {
        if(err){
          defer.reject(err);
        }else{
          defer.resolve(menus);
        }
      });
      return defer.promise;
    };
    queryMenus().then(function(menus) {
      res.send(menus);
    }).fail(function(err) {
      res.send(handleError(err));
    });
  });


  app.post('/admin/menus', function(req, res, next) {
    var data = req.body;
    var id = data._id?data._id:new mongoose.Types.ObjectId;
    delete data.__v;//https://github.com/LearnBoost/mongoose/issues/1933
    delete data._id;
    q.nfcall(Menus.count.bind(Menus)).then(function(count) {
      //calculate order;
      data.order || (data.order = count+1);  
    }).then(function() {

      return q.nfcall(Menus.findByIdAndUpdate.bind(Menus, id, data, {upsert: true}));
    }).then(function() {
      res.send('{status: success}');
    }).fail(function(err) {      
      res.send(handleError(err));
    });
  });

  app.delete('/admin/menus', function(req, res, next) {
    var id = req.body.id;
    Menus.findOneAndRemove({_id: id}, function(err) {
      if(err){
        res.send(handleError(err));
      }else{
        res.send('{status: success}');
      }
    });
  });

  var handleError = function(err) {
    return {status: 'error', err: err};
  };
}