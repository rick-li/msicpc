app.controller('ItemsCtrl', function($scope, $log) {
  $log.log('=====> Items Ctrl');
  $scope.categories = ['aaaa', 'bbbbb', 'cccc'];
  $scope.gridData = [{
    name: "Moroni",
    age: 50
  }, {
    name: "Tiancum",
    age: 43
  }, {
    name: "Jacob",
    age: 27
  }, {
    name: "Nephi",
    age: 29
  }, {
    name: "Enos",
    age: 34
  }, {
    name: "Moroni",
    age: 50
  }, {
    name: "Tiancum",
    age: 43
  }, {
    name: "Jacob",
    age: 27
  }, {
    name: "Nephi",
    age: 29
  }, {
    name: "Enos",
    age: 34
  }, {
    name: "Moroni",
    age: 50
  }, {
    name: "Tiancum",
    age: 43
  }, {
    name: "Jacob",
    age: 27
  }, {
    name: "Nephi",
    age: 29
  }, {
    name: "Enos",
    age: 34
  }];
  $scope.pagingOptions = {
    pageSizes: [10, 30, 50],
    pageSize: 10,
    currentPage: 1
  };
  $scope.$watch('pagingOptions', function(newVal, oldVal) {
    if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
      // $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      //calculate items
    }
  }, true);
  $scope.totalServerItems = $scope.gridData.length;
  $scope.gridOptions = {
    data: 'gridData',
    multiSelect: false,
    enableRowReordering: true,
    totalServerItems: 'totalServerItems',
    // selectedItems: 
    ColumnDefs: [],
    enablePaging: true,
    showFooter: true,
    pagingOptions: $scope.pagingOptions
  }
});