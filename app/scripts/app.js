$(document).ready(function() {
  angular.bootstrap(document, ['sicpcAdmin']);
});

var app = angular.module('sicpcAdmin', ['ngRoute', 'ngResource', 'angularFileUpload', 'ngGrid', 'ui.bootstrap']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/categories', {
      templateUrl: 'templates/categories.html',
      controller: 'CategoriesCtrl'
    })
    .when('/items', {
      templateUrl: 'templates/items.html',
      controller: 'ItemsCtrl'
    })
    .when('/itemEditor/:itemId', {
      templateUrl: 'templates/itemEditor.html',
      controller: 'ItemEditorCtrl'
    })
    .when('/menus', {
      templateUrl: 'templates/menus.html',
      controller: 'ItemsCtrl'
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