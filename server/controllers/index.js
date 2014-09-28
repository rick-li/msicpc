var _ = require('underscore');
var q = require('q');
var url = require('url');
var md5 = require('MD5');
var mysqlModels = require('../models/models-mysql.js');
var mongoModels = require('../models/models-mongo.js');
var ItemCtrl = require('./item.js');


var cateModel = new mysqlModels.Categories();
var itemModel = new mysqlModels.Items();


var menuModel = mongoModels.Menus;
var editorModel = mongoModels.EditorItems;
var topItemsModel = mongoModels.TopItems;
var homeCateModel = mongoModels.HomeCates;


module.exports.controller = function(app) {
  app.get('/', function(req, res, next) {
    res.redirect('index');
    return;
  });
  

  var handleIndex = function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    //home page
    if (!query.page) {
      query.page = '首页'
    }

    if (query.page === '首页') {
      renderHome(req, res, next);
      return;
    }else{
      renderOthers(req, res, next, query);
      // return;
    }
  };
  
  app.get('/home', handleIndex);
  app.get('/index', handleIndex);

  app.get('/search', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var searchTxt = query.q;

    q.all([q.nfcall(itemModel.search.bind(itemModel), searchTxt), getMenus()]).spread(function(items, allMenus) {
      q.all([ItemCtrl.addItemsPromise(items)]).spread(function(itemsData) {
        
        var data = {
          page: 'search',
          menus: allMenus,
          items: itemsData
      };
      // res.send(data);
        res.render('index', data);
      }).fail(function(err) {
        res.send(err)
      });
      
    });
  });


  var renderOthers = function(req, res, next, query) {
    console.log('in /others');
    var page = query.page;

    q.all([q.nfcall(menuModel.findOne.bind(menuModel), { name: page }), getMenus()]).spread(function(menu, allMenus) {
      
      var aCates = _.pluck(menu.categories, 'id');
      
      getCategoriesData(aCates).then(function(rData) {
        console.log('====> data received.')
        var data = {
          page: page,
          menus: allMenus,
          items: rData[0].items
        };

        console.log('====> before rendering');
        res.render('index', data);
        // res.send('hello');
      }).fail(function(e) {
        console.log('failed', e);
      });
    });
  };



  var renderHome = function(req, res, next) {
    console.log('in /home')
    q.all([getMenus(), editorModel.find().sort({
      order: 'asc'
    }).exec(), topItemsModel.find().sort({
      order: 'asc'
    }).exec(), homeCateModel.find().sort({
      order: 'asc'
    }).exec()])
      .spread(function(menus, editors, topItems, homeCates) {
        var defer = q.defer();
        q.all([ItemCtrl.addItemsPromise(editors)]).spread(function(editorsData) {
          defer.resolve([menus, editorsData, topItems, homeCates]);
        }).fail(function(e) {
          defer.reject(e);
        });
        return defer.promise;
      })
      .spread(function(menus, editors, topItems, homeCates) {
        // console.log('===== data resolved. ', homeCates)
        var mixedArray = homeCates.map(function(homeCate) {
          return homeCate.categories.map(function(cate) {
            return assembleCateAndItems(cate.id, homeCate.id);
          });
        });

        var catePromises = _.flatten(mixedArray);

        q.all(catePromises).then(function(homeCatesArray) {
          // console.log('home cates size ', homeCatesArray.length);
          // console.log('homeCateId: ', _.pluck(homeCatesArray, 'homeCateId'));
          var id2CateData = _.groupBy(homeCatesArray, 'homeCateId');
          // console.log('id2CateData: ', id2CateData);

          homeCates = homeCates.map(function(homeCate) {
            homeCate.data = id2CateData[homeCate.id];
            return homeCate;
          });

          var restIndex = homeCates.length % 2;
          var restItem;
          if (restIndex != 0) {
            restItem = homeCates[restIndex];
            homeCates = homeCates.slice(0, restIndex - 1);
          }
          var data = {
            page: '首页',
            menus: menus,
            editors: editors,
            topItems: topItems,
            homeCates: {
              nonRestCates: homeCates,
              restItem: restItem
            }
          };

          res.render('home', data);
        });
      });
  };


  var getMenus = function() {
    var defer = q.defer();
    menuModel.find().sort({
      order: 'asc'
    }).exec(function(err, menus) {

      //find parents for all nodes
      var findParent = function(node) {
        if (node.group) {
          menus.forEach(function(m) {
            if (m._id == node.group._id) {

              if (!m.child) {
                console.log(m)
              }
              if (m.child.indexOf(node) == -1) {
                m.child.push(node);
              }

              findParent(m);
            }
          });

        }
      };
      var menuTree = [];
      var removeLeafs = function() {
        menus.forEach(function(node) {
          if (!node.group && menuTree.indexOf(node) == -1) {
            menuTree.push(node);
          }
        });
      }
      menus.forEach(function(node) {
        findParent(node); //to create the tree
        removeLeafs();
      });
      console.log('get menus ', menuTree);

      // var level = 0;
      // menus.forEach(function(menu) {
      //   menu.level = level;
      //   if(menu.children){}
      // });

      defer.resolve(menuTree);

    });
    return defer.promise;
  };


  var getCategoriesData = function(cateIds) {
    return q.all(cateIds.map(function(cateId) {
      return assembleCateAndItems(cateId);
    }));
  };

  var assembleCateAndItems = function(cateId, homeCateId) {
    var cateWithItems = {};
    var defer = q.defer();
    cateModel.queryById(cateId, function(err, results) {
      var cate = results[0];
      if (err) {
        defer.reject(err);
      }

      cateWithItems = cate;
      itemModel.queryByCate(cate.id, function(err, items) {
        // console.log('query by cate size', items.length);
        //get image
        items = items.filter(function(item) {
          return !!item;
        }).map(function(item) {

          item.imageId = md5('Image' + item.id);
          item.data = ItemCtrl.getDataForItem(item, item.id); 
          return item;
        });
        
        cateWithItems.items = items;
        cateWithItems.homeCateId = homeCateId;
        defer.resolve(cateWithItems);
      }, 0 , 20);
    });
    return defer.promise;
  };

};