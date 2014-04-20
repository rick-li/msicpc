app.directive('ngConfirmClick', [
  function() {
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', function(e) {
          var message = attrs.ngConfirmClick;
          if (message && !confirm(message)) {
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    };
  }
]);

app.directive('ckeditor', function($log) {
  return {
    restrict: 'E',
    scope: {
      content: '=',
      ckheight: '@'
    },
    link: function(scope, elm, attr) {

      $log.log('attr is ', attr);

      var ck = CKEDITOR.replace(elm[0], {
        height: attr['ckheight'],
        language: 'zh-cn'
      });

      ck.on('instanceReady', function() {
        ck.setData(scope.$apply('content'));
        scope.$watch('content', function(newContent) {
          if (newContent !== ck.getData()) {
            $log.log('content changed, "', newContent, '"');
            ck.setData(newContent);
          }
        });

        ck.on('change', updateModel);
        ck.on('key', updateModel);

      });


      function updateModel() {
        scope.$apply(function() {
          scope.content = ck.getData();
        });
      }
    }
  };
});