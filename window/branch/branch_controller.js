app.controller('BranchCtrl', function ($scope, $state, $rootScope, branches, branchFactory) {

  $scope.branches = branches;

  $scope.switch = function (branchName) {
  	branchFactory.switchBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }

  $scope.newBranch = function(branchName) {
    branchFactory.switchBranch("master");
  	branchFactory.createNewBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }


});