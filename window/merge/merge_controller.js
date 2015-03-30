app.controller('MergeCtrl', function ($scope, repoFactory, $rootScope, mergeFactory) {
	console.log(mergeFactory)
    $scope.merge = function () {
        mergeFactory.merge()
        $scope.mergeConflictError = repoFactory.mergeConflictError
    }

    $scope.findConflicts = function () {
    	//mergeFactory.findConflicts()
    	mergeFactory.getConflicts()
    }


});