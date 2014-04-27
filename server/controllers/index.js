var q = require('q');
var url = require('url');
var md5 = require('MD5');
var models = require('../models/models-mysql.js');
module.exports.controller = function(app) {
  app.get('/index', function(req, res, next) {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    //home page
    if (!query.page || query.page == '首页') {
      req.url = '/home';
      next('route');
      return;
    }


    // source=1 titleImage=templates/jisheng_video/css/images/title-xinhun.jpg itemType=Video latestItemsCols=2 latestItemsLimit=3 latestItemsDisplayEffect=all userName=1 userImage=1 userDescription=1 userURL=1 userEmail=1 userFeed=1 categoryIDs=22|23|30 categoryTitle=1 categoryDescription=1 categoryImage=1 categoryFeed=1 latestItemTitle=1 latestItemTitleLinked=1 latestItemDateCreated=1 latestItemImage=1 latestItemImageSize=Medium latestItemVideo=1 latestItemVideoWidth= latestItemVideoHeight= latestItemVideoAutoPlay=0 latestItemIntroText=1 latestItemCategory=1 latestItemTags=1 latestItemReadMore=1 latestItemCommentsAnchor=0 feedLink=1 latestItemK2Plugins=0 page_title= show_page_title=1 pageclass_sfx= menu_image=-1 secure=0  
    q.nfcall(menuModel.queryByName.bind(menuModel), query.page).then(function(menu) {
      var sCateIds = menu[0].params.categoryIDs;
      var cateIds = sCateIds && sCateIds.split('|');

      q.all([getMenus(), getCategoriesData(cateIds)]).then(function(allData) {
        var menus = allData[0];
        var cateData = allData[1];
        cateData.forEach(function(cate) { //remove empty cate data.
          if (cate.items.length == 0) {
            console.log("remove ", cate.name);
            cateData.splice(cateData.indexOf(cate), 1);
          }
        });
        console.log("cate Data: ", cateData);
        res.render('index', {
          menus: menus,
          cateData: cateData,
          page: query.page
        });
      });
    });
  });


  app.get('/home', function(req, res, next) {
    res.send('home page');
  });



  var menuModel = new models.Menus();
  var cateModel = new models.Categories();
  var itemModel = new models.Items();
  var getMenus = function() {
    var defer = q.defer();
    menuModel.queryByParams(function(err, menus) {
      if (err) {
        defer.reject(err);
      }
      defer.resolve(menus);
    }, {
      itemType: 'video'
    });
    return defer.promise;
  };


  var getCategoriesData = function(cateIds) {
    return q.all(cateIds.map(function(cateId) {
      return assembleCateAndItems(cateId);
    }));
  };

  var assembleCateAndItems = function(cateId) {
    var cateWithItems = {};
    var defer = q.defer();
    cateModel.queryById(cateId, function(err, results) {
      var cate = results[0];
      if (err) {
        defer.reject(err);
      }

      cateWithItems = cate;
      itemModel.queryByCate(cate.id, function(err, items) {
        //get image
        items.map(function(item) {
          item.imageId = md5('Image' + item.id);
          return item;
        });
        cateWithItems.items = items;
        defer.resolve(cateWithItems);
      });
    });
    return defer.promise;
  };

};