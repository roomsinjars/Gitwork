app.controller('CommitCtrl', function ($scope, $state, $rootScope, Status, repoFactory, commitFactory) {
	
	$scope.commit = function (commitMsg) {
		repoFactory.commit($rootScope.repo, commitMsg)
	}

	$scope.add = function(file) {
		commitFactory.addFiles(file);
		$scope.getStatus();
		
	}

	$scope.remove = function(file) {
		commitFactory.removeFiles(file);
		$scope.getStatus();
	}

	$scope.getStatus = function() {
		Status.get().then(function(data) {
			$scope.filesUnstaged = [];
			$scope.filesStaged = [];
			console.log('data', data);
			for (var i=0; i< data.length; i++){
				console.log(data[i].tracked);
					if (data[i].staged == false) {
						$scope.filesUnstaged.push(data[i]);
					} else {
						$scope.filesStaged.push(data[i]);
					}
			}
		})
	}
});