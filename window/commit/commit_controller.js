app.controller('CommitCtrl', function ($scope, $state, $rootScope, repoFactory) {
	
	console.log('commitCtrl');
	$scope.commit = function (commitMsg) {
		repoFactory.commit($rootScope.repo, commitMsg)
	}

});