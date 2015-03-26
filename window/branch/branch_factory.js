app.factory('branchFactory', function ($rootScope, $q){
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
		},

		getAllBranches: function(){
			return $q(function (resolve, reject){
				fs.readdir(__dirname + '/.git/refs/heads', function(err, data){
					if (err) return reject(err);
	        resolve(data)
	      })
			})
		},

		currentBranch: ""

	}
});