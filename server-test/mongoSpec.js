process.env.NODE_ENV = 'unit';

var assert = require('assert');
var q = require('q');
var Models = require('../server/models/models.js');
var mongoose = require('../server/mongo.js');
var Item = Models.Item;
var Category = Models.Category;
describe('Mongo', function() {

  before(function(done) {
    //   console.log('before mongo====');

    // });

    q.nfcall(Item.find.bind(Item))
      .then(function(data) {
        return q.all(data.map(function(item) {
          return Item.remove(item).exec();
        }));
      })
      .then(function() {
        return q.nfcall(Category.find.bind(Category))
      })
      .then(function(data) {
        return q.all(data.map(function(cate) {
          return Category.remove(cate).exec();
        }));
      }).then(function() {
        done();
      });
  });

  describe('#Models', function() {
    it('Should handle reference correctly', function(done) {
      var category1 = new Category({
        name: 'cateory 1'
      });

      var item1 = new Item({
        name: 'test1',
        category: category1.id
      });

      q.nfcall(category1.save.bind(category1))
        .then(function() {
          return q.nfcall(item1.save.bind(item1));
        })
        .then(function() {
          return q.nfcall(Item.find.bind(Item));
        }).then(function(data) {

          return Item.populate(data, {
            path: 'category',
            Model: 'Category'
          });


        }).then(function(data) {
          console.log('data is ', data);
          done();
        });
    });
    it('Should save/load Item correctly.', function(done) {

      var category1 = new Models.Category({
        name: 'cateory 1'
      });


      var item1 = new Models.Item({
        name: 'test1',
        category: category1.id
      });

      q.nfcall(category1.save.bind(category1))
        .then(item1.save.bind(item1))
        .then(function() {
          console.log('nfcall done.')
          assert(true);
          done();
        });

    });
  });
});