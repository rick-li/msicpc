$(document).ready(function() {
  angular.bootstrap(document, ['sicpcAdmin']);
});

var app = angular.module('sicpcAdmin', ['ngRoute', 'ngResource', 'angularFileUpload', 'ngGrid', 'ui.bootstrap']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/topContents', {
      templateUrl: 'templates/topContents.html',
      controller: 'CategoriesCtrl'
    })
    .when('/editorRecommends', {
      templateUrl: 'templates/editorRecommends.html',
      controller: 'EditorRecommendsCtrl'
    })
    .when('/menus', {
      templateUrl: 'templates/menus.html',
      controller: 'MenusCtrl'
    })
    .otherwise({
      redirectTo: '/menus'
    });
});


app.controller('HeaderCtrl', function($scope, $location) {
  $scope.isMenuSelected = function(menu) {
    var currentPath = $location.path();
    return currentPath.indexOf(menu) !== -1;
  };
});