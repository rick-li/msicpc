var url = require('url');

module.exports.controller = function(app) {
  app.get('/index', function(req, res, next) {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log('query is ', query);

    res.render('index', query);
  });
};