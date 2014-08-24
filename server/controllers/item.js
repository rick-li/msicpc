var url = require('url');
var q = require('q');
var mysqlModels = require('../models/models-mysql.js');



module.exports.controller = function(app) {
  var contentRe = /{.+}(.+){.+}/;
  app.get('/item', function(req, res, next) {
    
    
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    if(query.id){
      var itemId = query.id;
      getContentPromise(itemId).then(function(url) {
        console.log('url is ', url);
        res.render('itemVideo', {url: 'http://www.sicpc.com/video'+url});        
      }).fail(function(err) {
        //TODO display error page.
        console.log('error ', err);
        res.render('itemVideo', {url:'asaaa'});
      });
      
    }
    
    
  });
  var itemModel = new mysqlModels.Items();
  var getContentPromise = function(itemId) {

    var defer = q.defer();
    itemModel.queryById(itemId, function(err, items) {
      var item = items[0];
        console.log('=======> returned', item);
        if(err || !item.video){
          console.log('======> rejecting...');
          defer.reject('no video found.');
          return;
        }
        console.log('=======>', item.video);

        var matches = item.video.match(contentRe);
        if(!matches){
          defer.reject('no video found.');
        }
        var url = matches[1];
        if(/flv$/.test(url)){
          url = url.replace('\.flv', '\.mp4');
        }
        defer.resolve(url);
      });
    return defer.promise;
  }

  app.get('/videoItem', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var videoUrl = query.videoUrl;
    
    res.render('itemVideo', {url: videoUrl});
  });
};