app.controller('BranchCtrl', function ($scope, $state, $rootScope, branchFactory) {
   console.log("root", $rootScope.repo);
  fs.readdir(__dirname + '/.git/refs/heads', function(err,data){
    if (err) throw err;
    $scope.branches = data;
    $scope.$digest();
  })


  $scope.switch = function (branchName) {
  	branchFactory.switchBranch(branchName);
  	branchFactory.currentBranch = branchName;
  	console.log("this", branchFactory.currentBranch);
  		// $scope.currentBranch = branchName;
  }

  $scope.newBranch = function(branchName) {

  	branchFactory.createNewBranch(branchName);
  	branchFactory.currentBranch = branchName;
  		// $scope.currentBranch = branchName;
  }


});