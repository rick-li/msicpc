var url = require('url');
var q = require('q');
var fs = require('fs');
var mysqlModels = require('../models/models-mysql.js');


var rootPath = '/home/sicpc/wwwroot/video/media/k2/';
require('dns').lookup(require('os').hostname(), function(err, add) {
  if (/^192\.168/.test(add)) {
    rootPath = '/Users/rickli/Documents/apps/sicpc/data/';
  }
});
var contentRe = /{.+}(.+){.+}/;

var itemModel = new mysqlModels.Items();

var addItemsPromise = function(items) {
  var contentRe = /{.+}(.+){.+}/;
  return q.all(items.filter(function(item) {
    return !!item;
  }).map(function(item) {
    var defer = q.defer();
    console.log('items promise -> ', item.itemId);
    itemModel.queryById(item.itemId, function(err, itemDatas) {
      var itemData = itemDatas[0];

      if (err) {
        defer.reject(err);
        return;
      }
      if(itemData){
        item.data = getDataForItem(itemData);  
      }
      
      defer.resolve(item);
    });
    return defer.promise;
  }).filter(function(item) {
    return !!item;
  }));
};

var getDataForItem = function(itemData) {
  var data = {};

  if (itemData && itemData.video) {
    data.type = '视频';
    matches = itemData.video.match(contentRe);
    if (matches) {
      var url = matches[1];
      if (/flv$/.test(url)) {
        url = url.replace('.flv', '.mp4');
      }
      data.url = 'http://www.sicpc.com/video' + url;
    }
  }
  if (itemData && itemData.gallery) {
    data.type = '图片';
    matches = itemData.gallery.match(contentRe);
    if (matches) {
      var galleryId = matches[1];
      var galleryPath = rootPath + 'galleries/' + galleryId;
      if (fs.existsSync(galleryPath)) {
        data.url = fs.readdirSync(galleryPath).filter(function(f) {
          console.log(f);
          return (/(jpg|JPG|png|PNG)$/).test(f);
        }).map(function(f) {
          console.log(f);
          return 'http://www.sicpc.com/video/media/k2/galleries/' + galleryId + '/' + f;
        }).join(',');
      }
    }
  }
  return data;
};


var getContentPromise = function(itemId) {
  var matches;
  var defer = q.defer();
  itemModel.queryById(itemId, function(err, itemDatas) {
    var itemData = itemDatas[0];

    if (err) {
      defer.reject(err);
      return;
    }
    defer.resolve(getDataForItem(itemData));
  });
  return defer.promise;
};

module.exports.controller = function(app) {

  app.get('/item', function(req, res) {

    var urlParts = url.parse(req.url, true);
    var query = urlParts.query;
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

};

module.exports.getDataForItem = getDataForItem;
module.exports.addItemsPromise = addItemsPromise;