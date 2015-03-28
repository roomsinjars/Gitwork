app.controller('addCtrl', function ($scope, $state, $rootScope, repoFactory, Status, addFactory) {
		
	// $scope.add = function(file) {
	// 	addFactory.addFile(file);
	// 	$state.go('add');
	// }

	$scope.getStatus = function() {
		Status.get().then(function(data) {
			$scope.status = data;
			$scope.files = data;
			$scope.$digest();
			console.log('scope status', $scope.status);
			console.log('scope files', $scope.files);
		})
	}
});