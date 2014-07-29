app.controller('MenusCtrl', function($scope, $log, $http) {
  $scope.selectedItem = {
    categories: [];
  };
  $scope.removeCategory = function(category) {
    $scope.selectedItem.categories.splice(category);
  };
  $scope.addCategory = function(category) {
    $scope.selectedItem.categories.push(category);
  }
});