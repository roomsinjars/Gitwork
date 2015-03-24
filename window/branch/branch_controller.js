app.controller('BranchCtrl', function ($scope, $state, repoFactory) {
	$scope.createBranch = function (branchName) {
      repoFactory.createBranch(branchName)
      $scope.branchName = ''
    }
});