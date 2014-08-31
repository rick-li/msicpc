var url = require('url');
var q = require('q');
var fs = require('fs');
var mysqlModels = require('../models/models-mysql.js');


var rootPath = '/home/sicpc/wwwroot/video/media/k2/';
require('dns').lookup(require('os').hostname(), function(err, add, fam) {
  if (/^192\.168/.test(add)) {
    rootPath = '/Users/rickli/Documents/apps/sicpc/data/';
  }
});



module.exports.controller = function(app) {
  var contentRe = /{.+}(.+){.+}/;
  app.get('/item', function(req, res, next) {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    if (query.id) {
      var itemId = query.id;
      getContentPromise(itemId).then(function(data) {
        res.send(data);
      }).fail(function(err) {
        //TODO display error page.
        console.log('error ', err);
        res.send({
          'status': 'error',
          'msg': err
        });
      });

    }


  });
  var itemModel = new mysqlModels.Items();
  var getContentPromise = function(itemId) {

    var defer = q.defer();
    itemModel.queryById(itemId, function(err, items) {
      var item = items[0];

      if (err) {
        defer.reject(err);
        return;
      }

      var res = {};
      console.log(item.video)
      console.log(item.gallery)
      if (item.video) {
        res.type = '视频';
        var matches = item.video.match(contentRe);
        if (matches) {
          var url = matches[1];
          if (/flv$/.test(url)) {
            url = url.replace('\.flv', '\.mp4');
          }
          res.url = 'http://www.sicpc.com/video' + url;
        }
      }
      if (item.gallery) {
        res.type = '图片';
        var matches = item.gallery.match(contentRe);
        if (matches) {
          var galleryId = matches[1];
          var galleryPath = rootPath + 'galleries/' + galleryId;
          if (fs.existsSync(galleryPath)) {
            res.url = fs.readdirSync(galleryPath).filter(function(f) {
              console.log(f);
              return /(jpg|JPG|png|PNG)$/.test(f);
            }).map(function(f) {
              console.log(f);
              return 'http://www.sicpc.com/video/media/k2/galleries/' + galleryId + '/' + f;
            }).join(',');
          }
        }
      }
      defer.resolve(res);
    });
    return defer.promise;
  }

  app.get('/videoItem', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var videoUrl = query.videoUrl;

    res.render('itemVideo', {
      url: videoUrl
    });
  });
};