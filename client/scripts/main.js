require.config({
  base_url: 'client/scripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'snapjs': '../bower_components/snapjs/snap.min',
    'owl': '../bower_components/OwlCarousel/owl-carousel/owl.carousel.min',
    'video': '../bower_components/videojs/dist/video-js/video',
    'hammer': '../bower_components/hammerjs/hammer',
    'domReady': '../bower_components/domReady/domReady'
  },
  shim: {
    'owl': ['jquery'],
    'snapjs': ['jquery'],
    'app': ['snapjs', 'owl', 'domReady']
  },
  deps: ['bootstrap']
});

