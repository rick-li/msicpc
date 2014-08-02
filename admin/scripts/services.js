var AdminCommonService = function($log) {
    this.fileChanged = function(finput) {

    var fileReader = new FileReader();
    fileReader.onloadend = function(e) {
      $scope.selectedItem.image = e.target.result;
      $scope.$apply();
    };

    fileReader.readAsDataURL(finput.files[0]);
  };

  this.moveup = function(item) {
    var idx = $scope.menus.indexOf(item);
    if (idx === 0) {
      return;
    }
    var targetIdx = idx - 1;
    $scope.doMove(item, idx, targetIdx);
  };

  this.movedown = function(item) {
    var idx = $scope.menus.indexOf(item);
    if (idx === $scope.menus.length - 1) {
      return;
    }
    var targetIdx = idx + 1;
    $scope.doMove(item, idx, targetIdx);
  };

  this.doMove = function(item, idx, targetIdx) {
    var targetItem = $scope.menus[targetIdx];
    //swap pos
    $scope.menus[idx] = targetItem;
    $scope.menus[targetIdx] = item;
    //swap idx
    var tmpOrder = item.order;
    item.order = targetItem.order;
    targetItem.order = tmpOrder;
  };

  this.delete = function(item) {
    $.ajax({method: 'delete', url: $scope.baseUrl, data: {id: item._id}}).done(function(res) {
      if (res.status === 'error') {
        alert(JSON.stringify(res));
      } else {
        $scope.init();
        $scope.$apply();
      }
    });
  };

  this.submit = function(item) {
    $scope.preSelectedIdx = $scope.menus.indexOf(item);
    if($scope.preSelectedIdx === -1){
      $scope.preSelectedIdx = 0;
    }
    $.post($scope.baseUrl, item).done(function(res) {
      if (res.status === 'error') {
        alert(JSON.stringify(res));
      } else {
        $scope.init();
        $scope.$apply();
      }
    });
  };
};

app.service('$adminCommonService', AdminCommonService);