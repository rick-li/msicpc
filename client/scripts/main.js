require.config({
  base_url: 'app/scripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'snapjs': '../bower_components/snapjs/snap.min',
    'owl': '../bower_components/OwlCarousel/owl-carousel/owl.carousel.min',
    'jwplayer': 'jwplayer/jwplayer',
    'jwhtml5': 'jwplayer/jwplayer.html5'
  },
  shim: {
    'owl': ['jquery'],
    'snapjs': ['jquery'],
    'mejsplayer': ['mejs'],
    'jwhtml5': ['jwplayer'],
    'app': ['snapjs', 'owl']
  }
});

require(['app']);