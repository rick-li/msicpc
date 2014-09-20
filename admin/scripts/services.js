var AdminCommonService = function($log) {

  this.copyCommonMethods = function($scope) {
    $scope.itemTypes = ['视频', '图片', '文字', '链接'];

    $scope.fileChanged = function(finput) {

      var fileReader = new FileReader();
      fileReader.onloadend = function(e) {
        $scope.selectedItem.image = e.target.result;
        $scope.$apply();
      };

      fileReader.readAsDataURL(finput.files[0]);
    };

    $scope.moveup = function(item) {
      var idx = $scope.items.indexOf(item);
      if (idx === 0) {
        return;
      }
      var targetIdx = idx - 1;
      $scope.doMove(item, idx, targetIdx);
    };

    $scope.movedown = function(item) {
      
      var idx = $scope.items.indexOf(item);
      if (idx === $scope.items.length - 1) {
        return;
      }
      var targetIdx = idx + 1;
      $scope.doMove(item, idx, targetIdx);
    };

    $scope.doMove = function(item, idx, targetIdx) {
      var targetItem = $scope.items[targetIdx];
      //swap pos
      $scope.items[idx] = targetItem;
      $scope.items[targetIdx] = item;
      //swap idx
      var tmpOrder = item.order;
      item.order = targetItem.order;
      targetItem.order = tmpOrder;

      $scope.submit(item);
      $scope.submit(targetItem);      
    };

    $scope.delete = function(item) {
      $.ajax({
        method: 'delete',
        url: $scope.baseUrl,
        data: {
          id: item._id
        }
      }).done(function(res) {
        if (res.status === 'error') {
          alert(JSON.stringify(res));
        } else {
          $scope.init();
          $scope.$apply();
        }
      });
    };

    $scope.submit = function(item) {
      $scope.preSelectedIdx = $scope.items.indexOf(item);
      if ($scope.preSelectedIdx === -1) {
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
};

app.service('$adminCommonService', AdminCommonService);