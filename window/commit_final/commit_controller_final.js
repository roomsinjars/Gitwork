app.controller('CommitFinalCtrl', function ($scope, $state, $rootScope, repoFactory, mergeError) {

	$scope.commit = function (commitMsg) {
		repoFactory.commit($rootScope.repo, commitMsg)
	}

	$scope.mergeError = mergeError


});