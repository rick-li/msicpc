define(function(require, exports, module) {
  (function (global) {
    var callbacksQueue = [];

    global.setInterval(function () {
        for (var i = 0; i < callbacksQueue.length; i++) {
            if (callbacksQueue[i] !== false) {
                callbacksQueue[i].call(null);
            }
        }

        callbacksQueue = [];
    }, 1000 / 60);

    global.requestAnimationFrame = function (callback) {
        return callbacksQueue.push(callback) - 1;
    }

    global.cancelAnimationFrame = function (id) {
        callbacksQueue[id] = false;
    }
}(window));
  require('video');
  var Hammer = require('hammer');
  var goback = function() {
    if (splayer) {
      try {
        splayer.dispose();
      } catch (e) {}

      try {
        splayer.pause();
      } catch (e) {}
    }
    $('.item-container').remove();
    $('.all-elements').show();
  };
  $(window).on('hashchange', function(e) {
    if (!window.location.hash) {
      goback();
    }
  });

  var splayer;

  var regex = /{(\S+)}(\S+){\S+}/;

  window.viewItem = function(title, type, image, text, url) {
    if (type === '链接') {
      window.location = url;
      return;
    }
    window.location.hash = 'item';
    (image === 'undefined') && (image = null);
    (text === 'undefined') && (text = null);
    (url === 'undefined') && (url = null);

    $('.all-elements').hide();
    var containerEl = $('<div class="item-container"><div class="item-header"><div class="item-back-btn"></div><div class="item-title"></div></div><div id="item-content" class="item-content"></div></div>');
    containerEl.appendTo($('body'));


    containerEl.find('.item-title').text(title);

    if (type === '文字') {
      playText(containerEl, text, image);
    } else if (type === '视频') {
      if (/mp3$/.test(url)) {
        playAudio(containerEl, url, image);
      } else {
        playVideo(containerEl, url, image);
      }

    } else if (type === '图片') {
      playImage(containerEl, url);
    }


    $('.item-back-btn').click(function() {
      history.back();
    });
  };

  function playImage(containerEl, url) {
    var images = url.split(',');
    var shtml = '<div class="sicpc-slider-container"><div class="sicpc-slider-wrap">';

    shtml += images.map(function(url) {
      return '<img src="' + url + '" alt="" class="box">';
    }).join('');
    shtml += '</div></div>'
    
    containerEl.find('.item-content').html(shtml);
    var imgW = $(window).width();
    $('.sicpc-slider-wrap img').width(imgW);
    $('.sicpc-slider-wrap').width(imgW * $('.sicpc-slider-wrap img').length);
    addImageBrowser($('.sicpc-slider-wrap')[0], $('.sicpc-slider-container'));
    

  }

  function playText(containerEl, text, image) {
    if (image) {
      var imageEl = $('<img src="' + image + '"/>');
      containerEl.find('.item-content').append(imageEl);
    }
    // text = $('<div>').html(text).text();
    var textEl = $('<div class="item-text">' + text + '</div>');
    containerEl.find('.item-content').append(textEl);
  }

  function playVideo(containerEl, url, image) {
    var videohtml = '<video id="splayer" width="100%" height= "300px" controls preload="auto" class="video-js vjs-default-skin vjs-big-play-centered" poster="' + image + '">' +
      '<source src="' + url + '" type="video/mp4" />' +
      '</video>'
    containerEl.find('.item-content').append($(videohtml));
    splayer = videojs('splayer');
  }

  function playAudio(containerEl, url, image) {
    // image = 'http://www.sicpc.com/video/media/k2/items/cache/2e2843e2ade511d88df42c8a44a73c77_Generic.jpg';
    var audiohtml = '<audio src="' + url + '" controls></audio>';
    if (image) {
      audiohtml = '<img src="' + image + '" class="responsive-image"/>' + audiohtml;
    }
    containerEl.find('.item-content').append($(audiohtml));
    splayer = $('audio')[0];
  }


  function addImageBrowser(targetEl, constraintEl) {
    var $currentEl = $(targetEl).find(':first');
    var isPinched = false;
    var handlePinch = function() {
      
      var initialTranslate, initialScale = 0,
        lastCenter = {
          x: 0,
          y: 0
        },
        xImage = 0,
        yImage = 0;
      return function(e) {
        isPinched = true;
        console.log(e.type, 'center: ', e.center, ' scale ', e.scale);
        if (e.type === 'pinchstart') {
          var w = $currentEl.width(),
            h = $currentEl.height();
          startPos = $currentEl.offset();

          var transform = $currentEl.data('transform') || {};
          initialTranslate = transform.translate3d || {
            x: 0,
            y: 0
          };
          initialScale = transform.scale || 1;

        } else if (e.type === 'pinchmove') {
          var scale = e.scale * initialScale;
          var center = e.center;
          scale < 1 && (scale = 1); //min scale = 1;

          xImage = xImage + (center.x - lastCenter.x) / scale;
          yImage = yImage + (center.y - lastCenter.y) / scale;

          var xNew = initialTranslate.x + (center.x - xImage) / scale;
          var yNew = initialTranslate.y + (center.y - yImage) / scale;
          console.log('x,y', xNew, ',', yNew);

          updateTransform($currentEl, {
            x: xNew,
            y: yNew
          }, scale, {
            x: xImage,
            y: yImage
          });
          lastCenter = center;
        }
      }
    };

    var handleCarousel = function($wrap) {
      var currIdx, w, initTranslate, direction, num = $wrap.find('.box').length;
      currIdx = 1;
      w = $('.box:first', $wrap).outerWidth();
      var reset = function() {
        $wrap.addClass('animate');
        updateTransform($wrap, {
            x: -(currIdx-1) * w,
            y: 0
          });
        addPinchHandler();
      };
      var prev = function() {
        currIdx--;
        currIdx<1 && (currIdx = 1);
        $currentEl = $wrap.find('.box:nth-child(' + currIdx + ')');

        if ($currentEl.length) {
          $wrap.addClass('animate');
          updateTransform($wrap, {
            x: -(currIdx - 1) * w,
            y: 0
          });
        } else {
          next();
        }
        addPinchHandler();
      };

      var next = function() {
        currIdx++;
        currIdx>num && (currIdx = num);
        $currentEl = $wrap.find('.box:nth-child(' + currIdx + ')');

        if ($currentEl.length) {
          $wrap.addClass('animate');
          updateTransform($wrap, {
            x: -(currIdx - 1) * w,
            y: 0
          });
        } else {
          prev();
        }
        addPinchHandler();
      };
      $wrap.on('transitionend', function() {
        $wrap.removeClass('animate');
      });
      return function(e) {
        if(isPinched)return;
        var thresold = w ;
        if (e.type === 'panstart') {
          var transform = $wrap.data('transform');
          initTranslate = transform && transform.translate3d;
          initTranslate || (initTranslate = {
            x: 0,
            y: 0
          });
        } else if (e.type === 'panmove') {

          //only supportx horizontal
          direction = e.deltaX < 0 ? true : false; //true next, false prev
          var dx = e.deltaX;
          var totalx = initTranslate.x + dx;
          console.log('handleCarousel '+ totalx);
          
          if (Math.abs(dx) < thresold) {
            //just translate the position
            console.log('dx: '+ dx);
            updateTransform($wrap, {
              x: totalx,
              y: 0
            });
          } //otherwise do nothing...
        } else if (e.type === 'panend') {
          if (Math.abs(e.deltaX) > w/2) {
            direction ? next() : prev();  
          }else{
            reset();
          }
        }
      }
    };

    var handleZoomPan = function($el, $parent) {
      var initTranslate, initPos;
      //ensure the el not exceed parent constraint
      var pw = $parent.width();
      var ph = $parent.height();
      if(ph == 0){
        ph = $(window).height();
      }
      console.log('====> ph is ', ph);
      // ph === '0px' && (ph = $el.width());
      var pLeftTopPos = $parent.offset()
      var pRightBottomPos = {
        top: pLeftTopPos.top + ph,
        left: pLeftTopPos.left + pw
      };

      console.log('lefttopPos', pLeftTopPos, 'rightbottomPos ', pRightBottomPos);
      var checkConstraint = function($el, deltaPos, totalDeltaPos) {
        console.log('deltaPos: ', deltaPos);
        var rect = $el[0].getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        //assume is minimium scale is 1, both w,h  >  pw, ph
        if (deltaPos.left > 0) {
          initPos.left + totalDeltaPos.left > pLeftTopPos.left && (deltaPos.left = pLeftTopPos.left - initPos.left);
        }

        if (deltaPos.left < 0) {
          initPos.left + totalDeltaPos.left + w < pRightBottomPos.left && (deltaPos.left = pRightBottomPos.left - w - initPos.left);
        }

        if (deltaPos.top > 0) {
          initPos.top + totalDeltaPos.top > pLeftTopPos.top && (deltaPos.top = pLeftTopPos.top - initPos.top);
        }

        if (deltaPos.top < 0) {
          initPos.top + totalDeltaPos.top + h < pRightBottomPos.top && (deltaPos.top = pRightBottomPos.top - h - initPos.top);
        }
        console.log('deltaPos ', deltaPos);
        return {
          x: deltaPos.left + initTranslate.x,
          y: deltaPos.top + initTranslate.y
        };
      };
      return function(e) {
        if(!isPinched)return;
        console.log(e.deltaX, e.deltaY);
        if (e.type === 'panstart') {
          var transform = $el.data('transform') || {};
          initTranslate = transform.translate3d || {
            x: 0,
            y: 0
          };
          initPos = $el.offset();
        } else if (e.type === 'panmove') {
          var dx = e.deltaX;
          var dy = e.deltaY;
          if(dx == 0 && dy == 0){
            return;
          }
          var totalX = initTranslate.x + dx;
          var totalY = initTranslate.y + dy;

          updateTransform($el, checkConstraint($el, {top: dy, left: dx}, {
            top: totalY,
            left: totalX
          }));
        }
      }
    };



    new Hammer(targetEl,{
        dragBlockHorizontal: true,
        recognizers: [
          [Hammer.Pan, {
            direction: Hammer.DIRECTION_HORIZONTAL
          }]
          ]
    }).on('panstart panmove panend', handleCarousel($(targetEl)));//for carousel


    function addPinchHandler() {
      new Hammer($currentEl[0], {
        dragBlockHorizontal: true,
        recognizers: [
          [Hammer.Pan, {
            direction: Hammer.DIRECTION_HORIZONTAL
          }],
          [Hammer.Pinch, {
            enable: true
          }],
          [Hammer.Tap, {
            enable: true,
            taps: 2
          }]
        ]
      }).on('tap', function(e) {
        $currentEl.css('webkitTransform', '').css('webkitTransformOrigin', '').data('transform', '');
        isPinched = false;
      })
      .on('pinchstart pinchmove pinchend', handlePinch())
      .on('panstart panmove panend', handleZoomPan($currentEl, $(constraintEl)));
    }

    //add to defaultEl;
    addPinchHandler();




    var locked = false;
    var updateTransform = function($el, translate3d, scale, origin) {
      locked = true;
      var transform = $el.data('transform') || {};
      if (translate3d) {
        transform.translate3d = translate3d;
      }

      if (scale) {
        transform.scale = scale;
      }

      if (origin) {
        transform.origin = origin;
      }
      $el.data('transform', transform);
      var webkitTransform = '';
      if (transform.translate3d) {
        webkitTransform += 'translate3d( ' + transform.translate3d.x + 'px,' + transform.translate3d.y + 'px, 0)';
      }

      if (transform.scale) {
        webkitTransform += ' scale(' + transform.scale + ',' + transform.scale + ')';
      }
      console.log('transform ', webkitTransform);

      window.requestAnimationFrame(function() {
        $el.css({
          webkitTransform: webkitTransform
        });

        if (transform.origin) {
          console.log(transform.origin);
          $el.css({
            webkitTransformOrigin: transform.origin.x + ' ' + transform.origin.y
          });
        }
        locked = false;
      });
    }
  }
 
});