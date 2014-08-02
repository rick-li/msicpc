app.controller('MenusCtrl', function($scope, $log, $http, $adminCommonService) {
  $scope.new = function() {
    $scope.selectedItem = {
      categories: []
    };
  };

  $scope.new();

  $scope.init = function() {
    if(!$scope.preSelectedIdx){
      $scope.preSelectedIdx = 0;
    }
    $scope.categories = [];

    $.get('/admin/menus').done(function(menus) {
      $scope.menus = menus;
      //replace group to reference
      menus.forEach(function(menu) {
        (menu.group && menu.group._id) && (menu.group = _.findWhere(menus, {
          _id: menu.group._id
        }));

      });

      $scope.selectedItem = menus[$scope.preSelectedIdx];

      $scope.$apply();
    });

    $.get('/admin/cates').done(function(cates) {
      $scope.categories = cates;

      $scope.$apply();
    });
  };

  $scope.init();

  $scope.cateNames = function(menu) {
    return _.pluck(menu.categories, 'name');
  };

  $scope.removeCategory = function(idx, cate) {

    $scope.selectedItem.categories.splice(idx, 1);
    $scope.categories.push(cate);
  };

  $scope.addCategory = function(idx, cate) {
    $scope.selectedItem.categories.push(cate);
    $scope.categories.splice(idx, 1);
  };

  $scope.baseUrl = '/admin/menus';
  //copy common methods from common service;
  angular.extend($scope, $adminCommonService);

});