require.config({
  base_url: 'app/scripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'snapjs': '../bower_components/snapjs/snap.min',
    'owl': '../bower_components/OwlCarousel/owl-carousel/owl.carousel.min',
    'video': '../bower_components/videojs/dist/video-js/video'
  },
  shim: {
    'owl': ['jquery'],
    'snapjs': ['jquery'],
    'app': ['snapjs', 'owl']
  }
});

require(['app']);