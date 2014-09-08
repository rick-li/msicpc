var pool = require('./mysql.js').pool;
var q = require('q');
var _ = require('underscore');
var squel = require('squel');
var prefix = 'jos_';

var getConnFn = pool.getConnection.bind(pool);

var baseMethods = {

  buildSql: function(table, fields, wheres, orders, limits, params) {

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

    if (params) {

      var self = this;
      Object.keys(params).forEach(function(paramKey) {
        sql.where(self.alias + '.params like ' + '\'%' + paramKey + '=' + params[paramKey] + '%\'');
      });
    }
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
    var pair = {};
    pair[this.alias + '.id'] = '?';
    var wheres = _.extend(pair, this.defaultWheres);
    var sql = this.buildSql(this.tableName, this.defaultFields, wheres, this.defaultOrder);
    this.execSql(sql, cb, id);
  },
  queryByName: function(name, cb) {
    var pair = {};
    pair[this.alias + '.name'] = '?';
    var wheres = _.extend(pair, this.defaultWheres);
    var sql = this.buildSql(this.tableName, this.defaultFields, wheres, this.defaultOrder);
    this.execSql(sql, cb, name);
  },




  execSql: function(sql, cb) {
    var args = Array.prototype.slice.call(arguments, 2);
    // console.log('args: ', args);

    q.nfcall(getConnFn).then(function(conn) {

      console.log('executing sql - ', sql);
      var defer = q.defer();
      conn.query(sql, args, function(err, res) {
        if (err) {
          defer.reject(err);
        }
        defer.resolve([res, conn]);
      });
      return defer.promise;
    }).then(function(args) {
      var res = args[0];
      var conn = args[1];

      var rows = res;
      cb(null, parseParams(rows));
      if (conn) {
        conn.release();
      }

    }).fail(function(err) {
      errHandler(err);
      cb(err);
    });
  }
};

var Categories = function() {
  this.alias = 'c';
  this.defaultWheres = {};
  this.defaultWheres[this.alias + '.trash'] = 0;
  this.defaultWheres[this.alias + '.published'] = 1;

  this.defaultOrder = {};
  this.defaultOrder[this.alias + '.ordering'] = true;

  this.defaultFields = [this.alias + '.id', this.alias + '.name', this.alias + '.params'];
  this.tableName = prefix + 'k2_categories as ' + this.alias;
};
_.extend(Categories.prototype, baseMethods);

//======================= Start Item =================
var Items = function() {
  this.alias = 'i';
  this.defaultWheres = {
    'i.trash': 0,
    'i.published': 1
  };
  this.defaultOrder = {
    'i.ordering': true
  };

  this.defaultFields = [this.alias + '.id', this.alias + '.title', this.alias + '.params', this.alias + '.gallery', this.alias + '.video', this.alias + '.introtext'];
  this.tableName = prefix + 'k2_items as ' + this.alias;
};
_.extend(Items.prototype, baseMethods);

Items.prototype.queryById = function(id, cb) {
  
  var pair = {};
  pair[this.alias + '.id'] = '?';
  var wheres = _.extend(pair, this.defaultWheres);
  var sql = this.buildSql(this.tableName, this.defaultFields, wheres, this.defaultOrder);
  this.execSql(sql, cb, id);
},

//category, start, limit, cb
Items.prototype.queryByCate = function() {
  var args = Array.prototype.slice.call(arguments);
  var cateId = args[0];
  var start = null;
  var limit = null;
  var cb = args[args.length - 1];
  if (args.length == 4) {
    start = args[1];
    limit = args[2];
  }
  var wheres = _.extend({
    'i.catid': 'c.id',
    'c.id': '?'
  }, this.defaultWheres);
  var table = this.tableName + ',' + prefix + 'k2_categories as c';
  var sql = this.buildSql(table, this.defaultFields, wheres, this.defaultOrder, [start, limit]);

  this.execSql(sql, cb, cateId);
};

Items.prototype.queryLatestCreated = function(cb, start, limit) {
  var orders = _.extend({
    'i.created': false
  }, this.defaultOrder);
  var sql = this.buildSql(this.tableName, this.defaultFields, this.defaultWheres, orders, [start, limit]);

  this.execSql(sql, cb);
};

Items.prototype.queryMostVisited = function(cb, start, limit) {
  var orders = _.extend({
    'i.hits': false
  }, this.defaultOrder);
  var sql = this.buildSql(this.tableName, this.defaultFields, this.defaultWheres, orders, [start, limit]);

  this.execSql(sql, cb);
};

//======================= Start Menu =================
var Menus = function() {
  this.alias = 'm';
  this.defaultWheres = {};
  this.defaultWheres[this.alias + '.published'] = 1;

  this.defaultOrder = {};
  this.defaultOrder[this.alias + '.ordering'] = true;

  this.defaultFields = [this.alias + '.name', this.alias + '.type', this.alias + '.link', this.alias + '.params'];
  this.tableName = prefix + 'menu as ' + this.alias;
};
_.extend(Menus.prototype, baseMethods);

Menus.prototype.queryByParams = function(cb, params) {
  var sql = this.buildSql(this.tableName, this.defaultFields, this.defaultWheres, this.defaultOrder, [], params);
  this.execSql(sql, cb);
}

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