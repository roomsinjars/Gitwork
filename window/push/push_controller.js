app.controller('PushCtrl', function ($state, $scope, $rootScope, branchFactory, $q) {

    $scope.push = function () {
    	return $q(function (resolve, reject) {
    		$rootScope.repo.remote_push("origin", branchFactory.currentBranch, function (err) {
    		    if (err) {reject(err)}
    		   	else {
    		   		var done = 'done'
    		   		resolve(done)
    		   	}
    		})
    	}).then(function (data) {
            $state.go('end')
        })
        
    }
});
