var mongoose = require('mongoose');
var q = require('q');

exports.addCommonMethods = function(app, url, Items) {
  var handleError = function(err) {
    return {
      status: 'error',
      err: err
    };
  };

  app.get(url, function(req, res, next) {
    var queryItems = function() {
      var defer = q.defer();
      Items.find().sort('order').exec(function(err, items) {
        if (err) {
          defer.reject(err);
        } else {
          defer.resolve(items);
        }
      });
      return defer.promise;
    };
    queryItems().then(function(items) {
      res.send(items);
    }).fail(function(err) {
      res.send(handleError(err));
    });
  });

  app.post(url, function(req, res, next) {
    var data = req.body;
    var id = data._id ? data._id : new mongoose.Types.ObjectId;
    delete data.__v; //https://github.com/LearnBoost/mongoose/issues/1933
    delete data._id;
    q.nfcall(Items.count.bind(Items)).then(function(count) {
      //calculate order;
      data.order || (data.order = count + 1);
    }).then(function() {

      return q.nfcall(Items.findByIdAndUpdate.bind(Items, id, data, {
        upsert: true
      }));
    }).then(function() {
      res.send('{status: success}');
    }).fail(function(err) {
      res.send(handleError(err));
    });
  });

  app.delete(url, function(req, res, next) {
    var id = req.body.id;
    Items.findOneAndRemove({
      _id: id
    }, function(err) {
      if (err) {
        res.send(handleError(err));
      } else {
        res.send('{status: success}');
      }
    });
  });
};