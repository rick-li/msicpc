var q = require('q');
var mysql = require('../server/models/mysql');

var pool = mysql.pool;

describe('mysql conn', function() {
  it('categories ', function(done) {
    q.nfcall(pool.getConnection.bind(pool)).then(function (conn) {
      console.log('connection success');
      var queryFn = conn.query.bind(conn);
      return q.nfcall(queryFn, 'select id, name, params from jos_k2_categories where trash=0 and published=1 order by ordering');
    }).then(function (results) {
      var rows = results[0]
      console.log('rows length is ', rows);
      done();
    }).fail(function (err) {
      console.log(err);
      done();
    });
  });
});
