require.config({
  base_url: 'app/scripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    "snapjs": "../bower_components/snapjs/snap.min"
  },
  shim: {
    'snapjs': ['jquery'],
    'app': ['jquery', 'snapjs']
  }
});

require(['app']);