app.controller('MenusCtrl', function($scope, $log, $http, $sfileupload) {
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


  $scope.fileChanged = function(finput) {

    var fileReader = new FileReader();
    fileReader.onloadend = function(e) {
      $scope.selectedItem.image = e.target.result;
      $scope.$apply();
    };

    fileReader.readAsDataURL(finput.files[0]);
  };

  $scope.moveup = function(item) {
    var idx = $scope.menus.indexOf(item);
    if (idx === 0) {
      return;
    }
    var targetIdx = idx - 1;
    $scope.doMove(item, idx, targetIdx);
  };

  $scope.movedown = function(item) {
    var idx = $scope.menus.indexOf(item);
    if (idx === $scope.menus.length - 1) {
      return;
    }
    var targetIdx = idx + 1;
    $scope.doMove(item, idx, targetIdx);
  };

  $scope.doMove = function(item, idx, targetIdx) {
    var targetItem = $scope.menus[targetIdx];
    //swap pos
    $scope.menus[idx] = targetItem;
    $scope.menus[targetIdx] = item;
    //swap idx
    var tmpOrder = item.order;
    item.order = targetItem.order;
    targetItem.order = tmpOrder;
  };

  $scope.delete = function(item) {
    $.ajax({method: 'delete', url: '/admin/menus', data: {id: item._id}}).done(function(res) {
      if (res.status === 'error') {
        alert(JSON.stringify(res));
      } else {
        $scope.init();
        $scope.$apply();
      }
    });
  };

  $scope.submit = function(item) {
    $scope.preSelectedIdx = $scope.menus.indexOf(item);
    if($scope.preSelectedIdx === -1){
      $scope.preSelectedIdx = 0;
    }
    $.post('/admin/menus', item).done(function(res) {
      if (res.status === 'error') {
        alert(JSON.stringify(res));
      } else {
        $scope.init();
        $scope.$apply();
      }
    });
  };
});