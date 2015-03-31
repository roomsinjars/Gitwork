app.controller('BranchCtrl', function ($scope, $state, $rootScope, branches, branchFactory) {

  $scope.branches = branches;

  $scope.switch = function (branchName) {
  	branchFactory.switchBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }

  $scope.newBranch = function(branchName) {
    branchFactory.switchBranch('master')
      .then(function (data) {
        return branchFactory.createNewBranch(branchName)
      }).then(function (data) {
        branchFactory.currentBranch = branchName;
        console.log(branchFactory.currentBranch)
        return branchFactory.switchBranch(branchName)
      }).then(function (data) {
        $state.go('work');
      })
  	
  }


});