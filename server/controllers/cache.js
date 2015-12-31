var url = require('url');
var q = require('q');
var fs = require('fs');
var md5 = require('MD5');
var mongoModels = require('../models/models-mongo.js');


module.exports.controller = function(app) {
  app.post('/cache', function(req, res){
    var cacheContent = req.body.content;
    var cacheMD5 = md5(cacheContent);
    mongoModels.Caches.findOne({md5: cacheMD5}).exec().then(function (cache) {
      if(cache){
        res.send(cache);
      }else{
        var newCache = new mongoModels.Caches({md5: cacheMD5, content: cacheContent});
        newCache.save(function(err, savedCache){
          if(err){
            console.log('Saving Cache failed.');
          }else{
            res.send(savedCache);
          }
        });
      }
    });

  });
  app.get('/cache', function(req, res) {
    var urlParts = url.parse(req.url, true);
    var query = urlParts.query;
    if (query.id) {
      var cacheId = query.id;
      mongoModels.Caches.findById(query.id).exec().then(function(cache){
        res.send(cache);
      });
    }else{
      res.send('');
    }
  });

};

