app.controller('CommitCtrl', function ($scope, $state, $rootScope, repoFactory) {

	$scope.commit = function (commitMsg) {
		repoFactory.commit($rootScope.repo, commitMsg)
	}

});