app.controller('HomeCatesCtrl', function($scope, $log, $http, $adminCommonService) {
  $scope.baseUrl = '/admin/homecates';

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
    $.get($scope.baseUrl).done(function(items) {

      $scope.items = items;

      //replace group to reference
      items.forEach(function(item) {
        (item.group && item.group._id) && (item.group = _.findWhere(items, {
          _id: item.group._id
        }));
      });

      $scope.selectedItem = items[$scope.preSelectedIdx];

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

  
  //copy common methods from common service;
  $adminCommonService.copyCommonMethods($scope);
});