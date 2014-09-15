define(function(require, exports, module) {
  var regex = /{(\S+)}(\S+){\S+}/;

  window.viewItem = function(title, type, image, text, url) {
    (image === 'undefined') && (image = null);
    (text === 'undefined') && (text = null);
    (url === 'undefined') && (url = null);
    
    $('.all-elements').hide();
    var containerEl = $('<div class="item-container"><div class="item-header"><div class="item-back-btn">返回</div><div class="item-title"></div></div><div class="item-content"></div></div>');
    containerEl.appendTo($('body'));
    
    
    containerEl.find('.item-title').text(title);    

    if (type==='文字') {
      playText(containerEl, text, image);
    } else {

      if (type === '视频') {
        playVideo(containerEl, url);
      } else if (type === '图片') {
        playImage(containerEl, url);
      }
    }

    $('.item-back-btn').click(function() {
      $('.item-container').remove();
      $('.all-elements').show();
    });
  };

  function playImage(containerEl, url) {
    var images = url.split(',');
    var shtml = '<div class="item-image-slider" data-snap-ignore="true">';

    shtml += images.map(function(url) {
      return '<div><img src="' + url + '" alt="" class="responsive-image"></div>';
    }).join('');
    shtml += '</div>';
    containerEl.find('.item-content').html(shtml);

    $('.item-image-slider').owlCarousel({
      slideSpeed: 500,
      paginationSpeed: 500,
      singleItem: true,
      pagination: false,
      startDragging: false
    });
  }

  function playText(containerEl, text, image) {
    if (image) {
      var imageEl = $('<img src="' + image + '"/>');
      containerEl.find('.item-content').append(imageEl);
    }
    text = $('<div>').html(text).text();
    var textEl = $('<div class="item-text">' + text + '</div>');
    containerEl.find('.item-content').append(textEl);
  }

  function playVideo(containerEl, url) {
    containerEl.find();
    var shtml = '<video id="video"  controls preload autoplay="autoplay" onclick="this.play()"><source src="' + url + '"></source></video>';
    containerEl.find('.item-content').html(shtml);
    var video = $('video')[0];
    video.addEventListener('canplay', function() {
      // alert('can play');
      video.play();
    });
    video.load();
    video.play();

    function onPause() {

      if (!video.webkitDisplayingFullscreen) {
        onEnd();
      }
    }

    function onEnd() {
      $('.item-container').remove();
      $('.all-elements').show();
    }

    video.addEventListener('pause', onPause, false);
    video.addEventListener('ended', onEnd, false);
  }
});