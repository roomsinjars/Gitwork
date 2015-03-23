app.controller('CommitCtrl', function ($scope, $state, $rootScope) {

	$scope.commit = function (commitMsg) {
		repoFactory.commit($rootScope.repo, commitMsg)
	}

});