app.controller('StatusCtrl', function ($scope, Status, $rootScope) {

	$scope.getStatus = function() {
		Status.get().then(function(data) {
			$scope.files = data;
			console.log('scope files', $scope.files);
		})
	}

})
