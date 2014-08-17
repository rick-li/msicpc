define(function(require, exports, module) {
  var regex = /{(\S+)}(\S+){\S+}/;
  window.displayItemDetail = function(data) {
    if(data.video){
      var matches = data.video.match(regex);
      var itemType = data.params['type'];
      var mediaType = matches[1];
      var mediaUrl = matches[2];
      if(mediaUrl){
        mediaUrl = mediaUrl.replace('flv', 'mp4');
      }

      console.log(itemType, ' , ', mediaType, ' , ', mediaUrl);
      window.location ='http://www.sicpc.com/video/' +mediaUrl;
    }
  };
});