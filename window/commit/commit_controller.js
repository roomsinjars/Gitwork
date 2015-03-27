app.controller('CommitCtrl', function ($scope, $state, $rootScope, repoFactory) {
	$scope.commit = function (commitMsg) {
		repoFactory.commit($rootScope.repo, commitMsg)
	}

	$scope.status = repoFactory.status($rootScope.repo, function(data){
		console.log(data);
		return data;
	})

});