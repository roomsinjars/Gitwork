app.controller('MergeCtrl', function ($scope, repoFactory, $rootScope, mergeFactory) {
    $scope.merge = function () {
        // mergeFactory.mergeSpawn().then(function (data) {
        //     console.log('this is the postmerge data', data)
        // })
        // .catch(function (err) {
        //     console.log('this is the error', err)
        // })
    	console.log($rootScope.repo.path)
        mergeFactory.getRepo($rootScope.repo.path)
        	.then(mergeFactory.getBranchCommit)
        	.then(mergeFactory.getMasterCommit)
        	.then(mergeFactory.mergeCommits)
        	.then(mergeFactory.addToIndex)
        	.then(mergeFactory.postMergeCommit)
        	// .then(function (repo) {
        	// 	console.log('got here', repo)
        	// })
        	.catch(function (err) {
                console.log(err)
                if (err.message === 'This merge has conflicts') {
                    mergeFactory.getConflicts()
                        .then(function (conflictFiles) {
                            $scope.conflictFiles = conflictFiles
                            $scope.mergeErr = err.message
                    })
                } else {
                    $scope.mergeErr = err.message
                }
        		
        	})
        	.then(function (repo) {
        	 	$scope.mergeSuccess = true;
        	})
        	

        
    }

    $scope.findConflicts = function () {
    	//mergeFactory.findConflicts()
    	mergeFactory.getConflicts()
    }


});