var url = require('url');
var q = require('q');
var fs = require('fs');
var md5 = require('MD5');
var mysqlModels = require('../models/models-mysql.js');


var rootPath = require('../imagePath.js').getImagePath();
var contentRe = /{.+}(.+){.+}/;

var itemModel = new mysqlModels.Items();

var addItemsPromise = function(items) {
  var contentRe = /{.+}(.+){.+}/;
  return q.all(items.filter(function(item) {
    return !!item;
  }).map(function(item) {
    console.log(item.id);
    var defer = q.defer();
    var itemId = item.id || item.itemId;
    console.log('items promise -> ', itemId);
    itemModel.queryById(itemId, function(err, itemDatas) {
      var itemData = itemDatas[0];

      if (err) {
        defer.reject(err);
        return;
      }
      if(itemData){
        item.data = getDataForItem(itemData, itemId);  
      }
      
      defer.resolve(item);
    });
    return defer.promise;
  }).filter(function(item) {
    return !!item;
  }));
};

var getDataForItem = function(itemData, itemId) {
  var data = {};
  if(!itemData){
    return data;
  }
  if (itemData.video) {
    data.type = '视频';
    matches = itemData.video.match(contentRe);
    if (matches) {
      var url = matches[1];
      if (/flv$/.test(url)) {
        url = url.replace('.flv', '.mp4');
      }
      var rImagePath = 'items/cache/'+md5('Image'+itemId)+'_Generic.jpg';
      console.log(itemId, '===>',rImagePath);
      var imagePath = rootPath + rImagePath;
      if(fs.existsSync(imagePath)){
        data.image = 'http://www.sicpc.com/video/media/k2/'+rImagePath;
      }
      data.url = 'http://www.sicpc.com/video' + url;
    }
  }else if ( itemData.gallery) {
    data.type = '图片';
    matches = itemData.gallery.match(contentRe);
    if (matches) {
      var galleryId = matches[1];
      var galleryPath = rootPath + 'galleries/' + galleryId;
      if (fs.existsSync(galleryPath)) {
        data.url = fs.readdirSync(galleryPath).filter(function(f) {
          
          return (/(jpg|JPG|png|PNG)$/).test(f);
        }).sort().map(function(f) {
          
          return 'http://www.sicpc.com/video/media/k2/galleries/' + galleryId + '/' + f;
        }).join(',');
        console.log('data url', data.url)
      }
    }
  }else{
    data.type = '文字';
    data.text = itemData.introtext;
    
    var rImagePath = 'items/cache/'+md5('Image'+itemId)+'_Generic.jpg';
    console.log(itemId, '===>',rImagePath);
    var imagePath = rootPath + rImagePath;
    if(fs.existsSync(imagePath)){
      data.image = 'http://www.sicpc.com/video/media/k2/'+rImagePath;
    }
  }
  data.title = itemData.title;
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