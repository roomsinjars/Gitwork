app.controller('StatusCtrl', function ($scope, Status, $rootScope) {

	$scope.getStatus = function() {
		Status.get().then(function(data) {
			$scope.status = data;
			$scope.files = data;
			$scope.$digest();
			console.log('scope status', $scope.status);
			console.log('scope files', $scope.files);
		})
	}

})
