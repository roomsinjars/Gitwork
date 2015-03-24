app.controller('BranchCtrl', function ($scope, $state, $rootScope) {
   console.log("root", $rootScope.repo);
  fs.readdir(__dirname + '/.git/refs/heads', function(err,data){
    if (err) throw err;
    $scope.branches = data;
    $scope.$digest();
  })

  $scope.switch = function(branchName) {
	  $rootScope.repo.checkout(branchName, function (err) {
	   if (err) throw err;
	   console.log(branchName);
	  })
  }
});