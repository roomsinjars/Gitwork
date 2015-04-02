app.factory('branchFactory', function ($rootScope, $q){
	return {

		switchBranch: function(branchName) {
			return $q(function (resolve, reject){
			  $rootScope.repo.checkout(branchName, function (err, data) {
			  	if (err) return reject(err);
					resolve(data)
				})
		  })
		},

		createNewBranch: function(branchName) {
			return $q(function (resolve, reject){
				$rootScope.repo.create_branch(branchName, function (err, data){
				if (err) return reject(err);
				resolve(data)
				})
			})
		},

		deleteOldBranch: function(branchName) {
			return $q(function(resolve, reject){
				$rootScope.repo.delete_branch(branchName, function (err, data){
					if (err) return reject(err);
					resolve(data)
				})
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
