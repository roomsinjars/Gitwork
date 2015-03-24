app.controller('BranchCtrl', function ($scope, $state, repoFactory, $rootScope) {
	$scope.createBranch = function (branchName) {
      repoFactory.createBranch(branchName)
      $rootScope.branchName = branchName;
      $scope.branchName = '';
    }
});