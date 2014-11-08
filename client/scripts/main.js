require.config({
  base_url: 'client/scripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'snapjs': '../bower_components/snapjs/snap.min',
    'owl': '../bower_components/OwlCarousel/owl-carousel/owl.carousel.min',
    'video': '../bower_components/videojs/dist/video-js/video',
    'hammer': 'touchnswipe/jquery.hammer.min',
    'modernizr': 'touchnswipe/modernizr.min',
    'tweenmax': 'touchnswipe/TweenMax.min',
    'touchnswipe': 'touchnswipe/TouchNSwipe.min',
    'domReady': '../bower_components/domReady/domReady',
    'enquire': '../bower_components/enquire/dist/enquire'
  },
  shim: {
    'touchnswipe': ['hammer', 'modernizr', 'tweenmax'],
    'owl': ['jquery'],
    'snapjs': ['jquery'],
    'app': ['snapjs', 'owl', 'domReady']
  },
  deps: ['bootstrap']
});

