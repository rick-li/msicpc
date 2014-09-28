'use strict';
// Generated on 2014-04-07 using generator-gulp-webapp 0.0.4

var gulp = require('gulp');

var wiredep = require('wiredep').stream;

var rjs = require('requirejs');

// Load plugins
var $ = require('gulp-load-plugins')();


// Styles
gulp.task('styles', function() {
  return gulp.src('admin/styles/main.scss')
    .pipe($.rubySass({
      style: 'expanded',
      loadPath: ['admin/libs']
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('admin/styles'))
    .pipe($.size());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('admin/scripts/**/*.js')
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'))
    .pipe($.size());
});

gulp.task('rjs', function() {
  rjs.optimize({
    baseUrl:'client/scripts',
    // appDir: 'client/scripts',
    mainConfigFile: 'client/scripts/main.js',
    out: "client/scripts/dist.js",
    optimize: "uglify",
    include: ['../bower_components/almond/almond.js']
  });
});

// HTML
// gulp.task('html', function() {
//   return gulp.src('app/*.html')
//     .pipe($.useref())
//     .pipe(gulp.dest('dist'))
//     .pipe($.size());
// });

// Images
gulp.task('images', function() {
  return gulp.src('client/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
    read: false
  }).pipe($.clean());
});

// Bundle
// gulp.task('bundle', ['styles', 'scripts'], $.bundle('./app/*.html'));

// Build
// gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

// Connect
gulp.task('connect', $.connect.server({
  root: ['app'],
  port: 9090,
  livereload: false
}));

// Inject Bower components
gulp.task('wiredep', function() {
  gulp.src('admin/styles/*.scss')
    .pipe(wiredep({
      directory: 'admin/libs',
      ignorePath: 'admin/libs/'
    }))
    .pipe(gulp.dest('admin/styles'));

  gulp.src('admin/*.html')
    .pipe(wiredep({
      directory: 'admin/libs',
      ignorePath: 'admin/'
    }))
    .pipe(gulp.dest('admin'));
});

// Watch
gulp.task('watch', ['connect'], function() {
  
  $.livereload.listen();
  // Watch for changes in `app` folder
  gulp.watch([
    'admin/*.html',
    'admin/styles/**/*.css',
    'admin/scripts/**/*.js',
    'admin/templates/**/*.html',
    'admin/images/**/*'
  ], $.livereload.changed);

  // Watch .scss files
  gulp.watch('admin/styles/**/*.scss', ['styles']);


  // Watch .js files
  // gulp.watch('admin/scripts/**/*.js', ['scripts']);

  // Watch image files
  // gulp.watch('app/images/**/*', ['images']);

  // Watch bower files
  // gulp.watch('app/libs/*', ['wiredep']);
});