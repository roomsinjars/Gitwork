app.controller('StatusCtrl', function ($scope, repoFactory, $rootScope) {

    $scope.status = function () {

        repoFactory.status($rootScope.repo, function (statusObj) {
        	var array = []
	        	var counter = 0
	        	for (var key in statusObj) {
	        		if (statusObj.hasOwnProperty(key)) {
	        	   		array[counter] = {};
	        	   		array[counter].fileName = key;
	        	        for (var prop in statusObj[key]) {
	        	        	if(statusObj[key].hasOwnProperty(prop)){
	        	        	    if (prop === 'staged') {
	        	        		    array[counter].staged = statusObj[key][prop]
	        	        	    } else {
	        	        	        array[counter].tracked = statusObj[key][prop]
	        	        	    }
	        	          }
	        	       }
	        	    }counter++
	        	}
	        	$scope.files = array
	        	$scope.$digest();
	        	console.log('this is scope.files', $scope.files)
        })
    }

});