module.exports.controller = function(app) {
  app.get('/login', function(req, res, next) {
    console.log('====> get login.');
    res.render('login', {});
  });

  app.post('/login', function(req, res, next) {
    console.log('====> post login.');
    req.session.userId = 'admin';
    res.send('User set successfully -> ', req.session.userId);
  });
}