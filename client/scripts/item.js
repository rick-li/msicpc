define(function(require, exports, module) {

  require('video');
  var player;

  var regex = /{(\S+)}(\S+){\S+}/;

  window.viewItem = function(title, type, image, text, url) {
    
    (image === 'undefined') && (image = null);
    (text === 'undefined') && (text = null);
    (url === 'undefined') && (url = null);
    
    $('.all-elements').hide();
    var containerEl = $('<div class="item-container"><div class="item-header"><div class="item-back-btn"></div><div class="item-title"></div></div><div id="item-content" class="item-content"></div></div>');
    containerEl.appendTo($('body'));
    
    
    containerEl.find('.item-title').text(title);    

    if (type==='文字') {
      playText(containerEl, text, image);
    } else if (type === '视频') {
        if(/mp3$/.test(url)){
          playAudio(containerEl, url, image);
        }else{
          playVideo(containerEl, url, image);  
        }
        
      } else if (type === '图片') {
        playImage(containerEl, url);
      }else if (type === '链接'){
        window.location = url;
      }
    

    $('.item-back-btn').click(function() {
      if(player){
        try{
          player.dispose();
          player.stop();
        }catch(e){} 
      }
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
    // text = $('<div>').html(text).text();
    var textEl = $('<div class="item-text">' + text + '</div>');
    containerEl.find('.item-content').append(textEl);
  }

  function playVideo(containerEl, url, image) {
    var videohtml = '<video id="player" width="100%" height= "300px" controls preload="auto" class="video-js vjs-default-skin vjs-big-play-centered" poster="'+image+'">'+
      '<source src="'+url+'" type="video/mp4" />'+
    '</video>'
    containerEl.find('.item-content').append($(videohtml));
    player = videojs('player');
  }

  function playAudio(containerEl, url, image) {
    // image = 'http://www.sicpc.com/video/media/k2/items/cache/2e2843e2ade511d88df42c8a44a73c77_Generic.jpg';
    var audiohtml = '<audio src="'+url+'" controls></audio>';
    if(image){
      audiohtml = '<img src="'+image+'" class="responsive-image"/>' + audiohtml;
    }
    containerEl.find('.item-content').append($(audiohtml));
    player = $('audio')[0];
  }
});