app.factory('addFactory', function($rootScope, Status){
	return {
		getStatus : function() {
			console.log('get status');
			Status.get().then(function(data) {
				$scope.files = data;
				$scope.$digest();
				console.log('scope files', $scope.files);
			})
		}

		// addFiles: function() {
		// 	return $q(function (resolve, reject){
		// 		$rootScope.repo.add(file, function (err, data){
		// 			if (err) return reject(err);
		// 			resolve(data)
		// 		})
		// 	})
		// }
	}
})