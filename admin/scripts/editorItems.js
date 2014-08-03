app.controller('EditorItemsCtrl', function($scope, $log, $http, $adminCommonService) {
  $scope.baseUrl = '/admin/editoritems';
  
  $scope.new = function() {
    $scope.selectedItem = {};
  };
  $scope.new();

  $scope.init = function() {
    if(!$scope.preSelectedIdx){
      $scope.preSelectedIdx = 0;
    }

    $.get($scope.baseUrl).done(function(items) {
      $scope.items = items;

      $scope.selectedItem = items[$scope.preSelectedIdx];

      $scope.$apply();
    });

  };
  $scope.init();

  
  //copy common methods from common service;
  $adminCommonService.copyCommonMethods($scope);

});