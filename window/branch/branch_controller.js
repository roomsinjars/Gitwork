app.controller('BranchCtrl', function ($scope, $state, $rootScope, branches, branchFactory) {

  console.log('branches: ', branches);

  $scope.branches = branches;

  console.log($scope.branches);


  $scope.switch = function (branchName) {
  	branchFactory.switchBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }

  $scope.newBranch = function(branchName) {
  	branchFactory.createNewBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }


});