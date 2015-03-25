app.controller('BranchCtrl', function ($scope, $state, $rootScope, repoFactory) {
   console.log("root", $rootScope.repo);
  fs.readdir(__dirname + '/.git/refs/heads', function(err,data){
    if (err) throw err;
    $scope.branches = data;
    $scope.$digest();
  })
  	// $scope.createBranch = function (branchName) {
   //      repoFactory.createBranch(branchName)
        
   //      ;
   //    }

  $scope.switch = function(branchName) {
	  $rootScope.repo.checkout(branchName, function (err) {
	   if (err) throw err;
	   console.log(branchName);
	  })
  }

  $scope.newBranch = function(branchName) {
  	$rootScope.repo.create_branch(branchName, function (err){
  		if (err) throw err;
      $rootScope.branchName = branchName;
      $scope.branchName = ''
  		$scope.switch(branchName);

  	})
  }
});