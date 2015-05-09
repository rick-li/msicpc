var requireLogin = false;
var models = require('../models/coupon-models');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var fs = require('fs');

module.exports.controller = function(app) {
  app.get('/coupon/index', function(req, res, next) {
    // var c = new models.Coupons({code: '12345'});
    // c.save(function () {
    //   console.log(arguments);
    // });
    // models.Coupons.findOneAndUpdate({}, {'status': 'locked'}).where('status').nin(['locked', 'taken']).exec().then(function (coupon) {
    //   res.set({ 'content-type': 'text/html; charset=utf-8' });
    //   if(!coupon){
    //     res.end('No Coupone available.');
    //   }else{
    //     res.end('Coupon '+coupon.company);  
    //   }
      
    // }).then(null, function (err) {
    //   console.log(err);
    //   res.end('Coupon err'+err);
    // });

    res.render('coupon-index');
    
  });

  app.get('/coupon/upload', function (req, res, next) {
    res.render('coupon-upload', {status: 'init'});
  });

  app.post('/coupon/upload', multipartMiddleware, function (req, res, next) {
    console.log('req.body', req.files.file.path);
    var content = fs.readFileSync(req.files.file.path, "utf-8");
    var aContent = content.split('\r\n');
    var error = false;
    aContent.forEach(function (item) {
      var aItem = item.split(',');
      console.log('code ', aItem[0]);
      models.Coupons.count({code: aItem[0]}, function (err, count) {
        if(err){
          console.log('error');
          error = err;
        }else{
          console.log('count is ', count)
          if(count <= 0){
            var c = models.Coupons({code: aItem[0], pass: aItem[1], status: 'initial' });
            c.save(function (err) {
              if(err){
                console.log('Error Saving ',c);
              }
            });
          }else{
            console.log('Coupon exists');
          }
        }
      });
      
    });
    res.render('coupon-upload', {status: 'success'});
  });

  app.get('/coupon/login', function(req, res, next){
    res.render('coupon-login');
  });
  app.post('/coupon/login', function (req, res, next) {
    // if(req.param)
    console.log(req.body);
    var name=req.body.name;
    var company=req.body.company;
    var cardno=req.body.cardno;

    models.Users.findOne({name: name, cardno: cardno, company: company}).exec().then(function (user) {
      if(user){
        if(user.hastaken){
          res.redirect('/coupon/login?error=2');
        }else{
          req.session.loggedin=true;
          req.session.user = user;
          res.redirect('/coupon/loggedin/showcoupon');
        }
      }else{
        res.redirect('/coupon/login?error=1');  
      }
    }).then(null, function (err) {
      console.log('err ', err);
    });
    
  });
  app.get('/coupon/loggedin/*', function (req, res, next) {
    
    if(requireLogin && !req.session.loggedin){
      res.redirect('/coupon/login');
    }else{
      next();  
    }
  });

  app.get('/coupon/loggedin/showcoupon', function(req, res, next){
    models.Coupons.findOneAndUpdate({status: 'taken'}).where('status').nin(['locked', 'taken']).exec().then(function (coupon) {
      if(coupon){
        console.log('user ', req.session.user);
        console.log('coupone ', coupon);
        models.Users.findByIdAndUpdate(req.session.user._id, {hastaken: true}).exec().then(function (user) {
          console.log('Set taken=true for ', user.name);
        });
        req.session.loggedin = false;  
        res.render('coupon-taken', coupon);
        return;
      }
      res.render('coupon-taken', {available: false});
    }).then(null, function (err) {
      console.log('err ', err);
    });
  });
};
  