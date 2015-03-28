app.controller('addCtrl', function ($scope, $state, $rootScope, repoFactory, Status, addFactory) {
		
	$scope.add = function(file) {
		addFactory.addFile(file);
		$state.go('add');
	}
});