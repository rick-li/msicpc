var MongoModels = require('../models/models-mongo.js');
var MysqlModels = require('../models/models-mysql.js');

var Categories = MysqlModels.Categories;
module.exports.controller = function(app) {
  app.get('/admin/cates', function(req, res, next) {
    new Categories().queryAll(function(err, cates) {
      if(err){
        console.log('err'); //TODO error handler.
      }else{
        cates.forEach(function(cate) {
          delete cate.params;
        });
       res.send(cates); 
      }
      
    });
  });
}