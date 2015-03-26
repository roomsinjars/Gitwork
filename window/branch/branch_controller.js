app.controller('BranchCtrl', function ($scope, $state, $rootScope, branches, branchFactory) {
   console.log("root", $rootScope.repo);

  branchFactory.branches = branches.data;
  $scope.branches = branches.data;
  $scope.$digest();

  $scope.switch = function (branchName) {
  	branchFactory.switchBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }

  $scope.newBranch = function(branchName) {
  	branchFactory.createNewBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }


});