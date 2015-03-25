app.factory('branchFactory', function ($rootScope){
	return {

		switchBranch: function(branchName) {
		  $rootScope.repo.checkout(branchName, function (err) {
		   if (err) throw err;
		  })
		},

		createNewBranch: function(branchName) {
			$rootScope.repo.create_branch(branchName, function (err){
				if (err) throw err;
				$scope.switch(branchName);
			})
		}

	}
});