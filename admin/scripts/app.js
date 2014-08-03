$(document).ready(function() {
  angular.bootstrap(document, ['sicpcAdmin']);
});

var app = angular.module('sicpcAdmin', ['ngRoute', 'ngResource', 'angularFileUpload', 'ngGrid', 'ui.bootstrap']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/homeCates', {
      templateUrl: 'templates/homeCates.html',
      controller: 'HomeCatesCtrl'
    })
    .when('/editorItems', {
      templateUrl: 'templates/editorItems.html',
      controller: 'EditorItemsCtrl'
    })
    .when('/topItems', {
      templateUrl: 'templates/topItems.html',
      controller: 'TopItemsCtrl'
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