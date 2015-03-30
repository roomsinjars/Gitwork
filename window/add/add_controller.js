app.controller('addCtrl', function ($scope, $state, $rootScope, Status, addFactory) {
		
	$scope.add = function(file) {
		addFactory.addFiles(file);
	}

	$scope.remove = function(file) {
		addFactory.removeFiles(file);
	}

	$scope.getStatus = function() {
		Status.get().then(function(data) {
			$scope.filesUnstaged = [];
			$scope.filesStaged = [];
			console.log('data', data);
			for (var i=0; i< data.length; i++){
				console.log(data[i].tracked);
				// if (data[i].tracked === "M" || data[i].tracked === "A"){
					if (data[i].staged == false) {
						$scope.filesUnstaged.push(data[i]);
					} else {
						$scope.filesStaged.push(data[i]);
					}
				// }
			}
		})
	}
});