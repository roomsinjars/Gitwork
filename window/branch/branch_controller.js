app.controller('BranchCtrl', function ($scope, $state, $rootScope, branches, branchFactory) {

  $scope.branches = branches;

  $scope.switch = function (branchName) {
    console.log('switch', branchName);
  	branchFactory.switchBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }

  $scope.newBranch = function(branchName) {
    console.log('initial', $scope.branchName);
    branchFactory.switchBranch('master')
      .then(function (data) {
        console.log('data', data, 'branchName', branchName)
        return branchFactory.createNewBranch(branchName)
      }).then(function (data) {
        branchFactory.currentBranch = branchName;
        console.log('bf', branchFactory.currentBranch, 'name', branchName)
        return branchFactory.switchBranch(branchName)
      }).then(function (data) {
        $state.go('work');
      })
  	
  }


});