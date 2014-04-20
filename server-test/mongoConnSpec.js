var assert = require('assert');

var mongoose = require('mongoose');
describe('description', function() {
  it('description', function(done) {
    mongoose.connect('mongodb://localhost:27017/sicpc-video', function(err) {
      if (err) {
        console.log('Error is ', err);
      } else {
        assert(true);
        console.log('connected successfully.');
      }

      done();
    });
  });

});