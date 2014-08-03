app.controller('TopItemsCtrl', function($scope, $log, $http, $adminCommonService) {
  $scope.new = function() {
    $scope.selectedItem = {};
  };
  $scope.new();

  $scope.init = function() {
    if(!$scope.preSelectedIdx){
      $scope.preSelectedIdx = 0;
    }

    $.get('/admin/topitems').done(function(items) {
      $scope.items = items;

      $scope.selectedItem = items[$scope.preSelectedIdx];

      $scope.$apply();
    });

  };
  $scope.init();

  $scope.baseUrl = '/admin/topitems';
  //copy common methods from common service;
  $adminCommonService.copyCommonMethods($scope);

});