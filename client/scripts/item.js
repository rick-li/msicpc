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
  var touchnswipe = require('touchnswipe');
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
    }else{
      if(window.hashSetByItem){
        window.hashSetByItem = false;
        return;
      }
      window.openItemUrl();
    }
  });

  var splayer;

  var regex = /{(\S+)}(\S+){\S+}/;

  window.viewItem = function(title, type, image, text, url) {
    

    if (type === '链接') {
      window.location = url;
      return;
    }
    
    (image === 'undefined' || image === 'null') && (image = null);
    (text === 'undefined') && (text = null);
    (url === 'undefined') && (url = null);
    window.hashSetByItem = true;
    window.location.hash = 'item!'+title+'!'+type+'!'+image+'!'+text+'!'+url;

    $('.all-elements').hide();
    var containerEl = $('<div class="item-container"><div class="item-header"><div class="item-back-btn"></div><div class="item-title"></div></div><div id="item-content" class="item-content"></div></div>');
    containerEl.appendTo($('body'));
    containerEl.find('.item-title').text(title);
// playImage(containerEl, url);
//     return;
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
      location.href = '/index';
    });
  };

  function playImage(containerEl, url) {
    var images = url.split(',');
    
    var shtml = '<div class="sliderHolder" data-elem="sliderHolder">'+
    '<div class="slider" data-elem="slider" data-options="" data-show="" data-hide="">'+
        '<div class="slides" data-elem="slides"></div>'+
         '<ul data-elem="items">';
    shtml += images.map(function(url) {
          return '<li><img src="' + url + '" alt=""/></li>';
    }).join('');
            
    shtml += '</ul>';
    shtml += '</div>';
    shtml += '</div>';

    containerEl.find('.item-content').html(shtml);
    TouchNSwipe.init();
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
    $('.item-content').css({'background': 'black'});
    var videohtml = '<video id="splayer" width="100%" height= "50%" controls preload="auto" class="video-js vjs-default-skin vjs-big-play-centered" poster="' + image + '">' +
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

 
});