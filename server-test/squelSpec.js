var squel = require('squel');


describe('description', function() {
  it('description', function(done) {
    var sql = squel.select().field('i.id').from('items as i').where('i.id = ?').order('ordering');
    //check override

    console.log(sql.toString());
    done();
  });
});