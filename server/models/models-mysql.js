var pool = require('./mysql.js').pool;
var q = require('q');
var _ = require('underscore');
var squel = require('squel');
var prefix = 'jos_';

var getConnFn = pool.getConnection.bind(pool);

var baseMethods = {

  buildSql: function(table, fields, wheres, orders, limits) {

    var sql = squel.select().from(table);
    fields.forEach(function(field) {
      sql.field(field);
    });

    Object.keys(wheres).forEach(function(whereKey) {
      sql.where(whereKey + '=' + wheres[whereKey]);
    });

    Object.keys(orders).forEach(function(orderKey) {
      sql.order(orderKey, orders[orderKey]);
    });
    if (limits) {
      if (limits[0]) {
        sql.offset(limits[0]);
      }
      if (limits[1]) {
        sql.limit(limits[1]);
      }
    }

    var strSql = sql.toString();
    console.log('sql is ', strSql);

    return strSql;
  },
  queryAll: function(cb) {
    var sql = this.buildSql(this.tableName, this.defaultFields, this.defaultWheres, this.defaultOrder);
    this.execSql(sql, cb);
  },
  queryById: function(id, cb) {
    var wheres = _.extend({
      'c.id': '?'
    }, this.defaultWheres);
    var sql = this.buildSql(this.tableName, this.defaultFields, wheres, this.defaultOrder);
    this.execSql(sql, cb, id);
  },
  queryByName: function(name, cb) {
    var wheres = _.extend({
      'c.name': '?'
    }, this.defaultWheres);
    var sql = this.buildSql(this.tableName, this.defaultFields, wheres, this.defaultOrder);
    this.execSql(sql, cb, name);
  },
  execSql: function(sql, cb) {
    var args = Array.prototype.slice.call(arguments, 2);
    console.log('args: ', args);
    q.nfcall(getConnFn).then(function(conn) {
      var queryfn = conn.query.bind(conn);
      console.log('sql is ', sql);
      return q.nfcall(queryfn, sql, args);
    }).then(function(res) {
      var rows = res && res[0];
      cb(null, parseParams(rows));
    }).fail(function(err) {
      errHandler(err);
      cb(err);
    });
  }
};

var Categories = function() {
  this.defaultWheres = {
    'c.trash': 0,
    'c.published': 1
  };
  this.defaultOrder = {
    'c.ordering': true
  };
  this.defaultFields = ['c.id', 'c.name', 'c.params'];
  this.tableName = prefix + 'k2_categories as c';
};
_.extend(Categories.prototype, baseMethods);

//======================= Start Item =================
var Items = function() {
  this.defaultWheres = {
    'i.trash': 0,
    'i.published': 1
  };
  this.defaultOrder = {
    'i.ordering': true
  };

  this.defaultFields = ['i.id', 'i.title', 'i.params'];
  this.tableName = prefix + 'k2_items as i';
};
_.extend(Items.prototype, baseMethods);


Items.prototype.queryByCate = function(category, cb, start, limit) {
  var wheres = _.extend({
    'i.catid': 'c.id',
    'c.id': '?'
  }, this.defaultWheres);
  var table = this.tableName + ',' + prefix + 'k2_categories as c';
  var sql = this.buildSql(table, this.defaultFields, wheres, this.defaultOrder, [start, limit]);

  this.execSql(sql, cb, category.id);
};

Items.prototype.queryLatestCreated = function(cb, start, limit) {
  var orders = _.extend({
    'created': false
  }, this.defaultOrder);
  var sql = this.buildSql(this.tableName, this.defaultFields, this.defaultWheres, orders, [start, limit]);

  this.execSql(sql, cb);
};

Items.prototype.queryMostVisited = function(cb, start, limit) {
  var orders = _.extend({
    'hits': false
  }, this.defaultOrder);
  var sql = this.buildSql(this.tableName, this.defaultFields, this.defaultWheres, orders, [start, limit]);

  this.execSql(sql, cb);
};

//======================= Start Menu =================
var Menus = function() {
  this.defaultWheres = {
    'm.published': 1
  };
  this.defaultOrder = {
    'm.ordering': true
  };

  this.defaultFields = ['m.name', 'm.type', 'm.link', 'm.params'];
  this.tableName = prefix + 'menu as m';
};
_.extend(Menus.prototype, baseMethods);


//====================== Utils ======================
var errHandler = function(err) {
  console.log(err);
};

//parse and replace params  key=value\nkey1=value1\nkey2=value2
var parseParams = function(p) {
  var parseOneRow = function(row) {

    if (row.params) {
      var params = row.params;
      row.params = _.object(params.split('\n').map(function(pair) {
        return pair.split('=');
      }));
    }
  };
  if (p) {
    if (Array.isArray(p)) {

      p.forEach(parseOneRow);
    } else {
      parseOneRow(p);
    }
  }
  return p;
};

exports.Categories = Categories;
exports.Items = Items;
exports.Menus = Menus;