// var _ = require('underscore');
// var q = require('q');
// var url = require('url');
// var md5 = require('MD5');
// var mysqlModels = require('../models/models-mysql.js');
// var mongoModels = require('../models/models-mongo.js');

// var menuModel = new mongoModels.Menus();
// var cateModel = new mysqlModels.Categories();
// var itemModel = new mysqlModels.Items();

// var editorModel = mongoModels.EditorRecommends;
// var topItemsModel = mongoModels.TopItems;
// var homeCateModel = mongoModels.HomeCates;


// module.exports.controller = function(app) {
//     app.get('/index', function(req, res, next) {

//         var url_parts = url.parse(req.url, true);
//         var query = url_parts.query;

//         //home page
//         if (!query.page){
//             res.redirect('index?page=首页');
//             return;
//         }

//         if(query.page === '首页'){
//             renderHome(req, res, next);
//             return;
//         }

//         res.render('index', {
//             menus: [],
//             cateData: [],
//             page: query.page
//         });

//     });
    
//     var renderHome = function(req, res, next) {
//         console.log('in /home')
//          q.all([editorModel.find().sort({
//             order: 'asc'
//         }).exec(), topItemsModel.find().sort({
//             order: 'asc'
//         }).exec(), homeCateModel.find().sort({
//             order: 'asc'
//         }).exec()]).spread(function(editors, topItems, homeCates) {
//             console.log('rednering home');
            
            
//             var mixedArray = homeCates.map(function(homeCate) {
//                 return homeCate.categories.map(function(cate) {
//                     return assembleCateAndItems(cate.id, homeCate.id);
//                 });
//             });

//             var catePromises = _.flatten(mixedArray);
            
//             q.all(catePromises).then(function(homeCatesArray) {
//                 // console.log('home cates size ', homeCatesArray.length);
//                 // console.log('homeCateId: ', _.pluck(homeCatesArray, 'homeCateId'));
//                 var id2CateData = _.groupBy(homeCatesArray, 'homeCateId');
//                 // console.log('id2CateData: ', id2CateData);

//                 homeCates = homeCates.map(function(homeCate) {
//                     homeCate.data = id2CateData[homeCate.id];
//                     return homeCate;
//                 });

//                 var restIndex = homeCates.length % 2;
//                 var restItem;
//                 if(restIndex != 0){
//                     restItem = homeCates[restIndex];
//                     homeCates = homeCates.slice(0, restIndex - 1);
//                 }
//                 var data = {
//                     editors: editors,
//                     topItems: topItems,
//                     homeCates: {
//                         nonRestCates: homeCates,
//                         restItem: restItem
//                     }
//                 };
                
//                 res.render('home', data);
//             });
//         });
//     };


//     var getMenus = function() {
//         var defer = q.defer();
//         Menus.find().sort({
//             order: 'asc'
//         }).exec(function(err, menus) {

//             //find parents for all nodes
//             var findParent = function(node) {
//                 if (node.group) {
//                     menus.forEach(function(m) {
//                         if (m._id == node.group) {
//                             if (!m.child) {
//                                 m.child = [];
//                             }
//                             if (m.child.indexOf(node) == -1) {
//                                 m.child.push(node);
//                             }

//                             findParent(m);
//                         }
//                     });

//                 }
//             };
//             var menuTree = [];
//             var removeLeafs = function() {
//                 menus.forEach(function(node) {
//                     if (!node.group && menuTree.indexOf(node) == -1) {
//                         menuTree.push(node);
//                     }
//                 });
//             }
//             menus.forEach(function(node) {
//                 findParent(node); //to create the tree
//                 removeLeafs();
//             });
//             console.log('menus ', menus);
//             defer.resolve(menus);

//         });
//         return defer.promise;
//     };


//     var getCategoriesData = function(cateIds) {
//         return q.all(cateIds.map(function(cateId) {
//             return assembleCateAndItems(cateId);
//         }));
//     };

//     var assembleCateAndItems = function(cateId, homeCateId) {
//         var cateWithItems = {};
//         var defer = q.defer();
//         cateModel.queryById(cateId, function(err, results) {
//             var cate = results[0];
//             if (err) {
//                 defer.reject(err);
//             }

//             cateWithItems = cate;
//             itemModel.queryByCate(cate.id, function(err, items) {
//                 // console.log('query by cate size', items.length);
//                 //get image
//                 items = items.map(function(item) {
//                     item.imageId = md5('Image' + item.id);
//                     return item;
//                 });

//                 cateWithItems.items = items;
//                 cateWithItems.homeCateId = homeCateId;
//                 defer.resolve(cateWithItems);
//             });
//         });
//         return defer.promise;
//     };

// };