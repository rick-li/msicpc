var assert = require('assert');
var q = require('q');
var models = require('../server/models/models-mysql.js');
var chai = require('chai');
var expect = chai.expect;

var categories = new models.Categories();

describe('Categories', function() {
  it('should query by name', function(done) {
    categories.queryByName('广播', function(err, rows) {
      console.log('rows is ', rows);
      assert(rows.length == 1);
      done();
    });
  });
  it('should query by id', function(done) {
    categories.queryById('12', function(err, rows) {
      console.log('rows is ', rows);
      assert(rows.length == 1);
      done();
    });
  });
  it('should query all', function(done) {
    categories.queryAll(function(err, rows) {
      // console.log('rows is ', rows);
      console.log('length is ', rows.length);
      assert(rows.length > 5);
      done();
    });
  });

  var items = new models.Items();
  describe('Items', function() {
    it('should query all', function(done) {
      items.queryAll(function(err, rows) {
        console.log('length is ', rows.length);
        assert(rows.length > 5);
        done();
      })
    });
    it('should query by cate', function(done) {
      categories.queryByName('广播', function(err, rows) {
        expect(err).to.be.null;
        items.queryByCate(rows[0].id, 1, 5,
          function(err, rows) {
            expect(err).to.be.null;
            console.log(rows.length);
            assert(rows.length == 5);
            done();
          });
      });
    });
    it('should query latest created', function(done) {
      items.queryLatestCreated(function(err, rows) {
        expect(err).to.be.null;
        assert(rows.length == 5);
        done();
      }, 1, 5);
    });

    it('should query most visited', function(done) {
      items.queryMostVisited(function(err, rows) {
        expect(err).to.be.null;
        assert(rows.length == 5);
        done();
      }, 1, 5);
    });
  });

  var menus = new models.Menus();
  describe('Menus', function() {
    it('should get menus', function(done) {
      menus.queryByParams(function(err, rows) {
        expect(err).to.be.null;
        assert(rows.length > 6);
        done();
      }, {
        itemType: 'video'
      });

    });


  });

});