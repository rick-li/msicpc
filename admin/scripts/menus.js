app.controller('MenusCtrl', function($scope, $log, $http, $sfileupload) {
  $scope.selectedItem = {
    categories: []
  };

  $scope.categories = [];

  $.get('/admin/menus').done(function(menus) {
    $scope.menus = menus;
    $scope.$apply();
  });

  $.get('/admin/cates').done(function(cates) {
    $scope.categories = cates;
    $scope.$apply();
  });

  $scope.removeCategory = function(idx, cate) {

    $scope.selectedItem.categories.splice(idx, 1);
    $scope.categories.push(cate);
  };

  $scope.addCategory = function(idx, cate) {
    $scope.selectedItem.categories.push(cate);
    $scope.categories.splice(idx, 1);
  };


  $scope.fileChanged = function(finput) {
    
    var fileReader = new FileReader();
    fileReader.onloadend = function(e) {
      $scope.selectedItem.image = e.target.result;
      $scope.$apply();
    }
    
    fileReader.readAsDataURL(finput.files[0]);
  };

  $scope.submit = function(item) {
    $.post('/admin/menus', item).done(function() {
      console.log('admin menu posted done.');
    });
  };

  $scope.debug = function() {
    console.log($scope.selectedParentMenu);
  }
});