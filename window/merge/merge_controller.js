app.controller('MergeCtrl', function ($scope, repoFactory, $rootScope, mergeFactory) {
    $scope.merge = function () {
        // mergeFactory.mergeSpawn().then(function (data) {
        //     console.log('this is the postmerge data', data)
        // })
        // .catch(function (err) {
        //     console.log('this is the error', err)
        // })
        mergeFactory.mergeSpawn().then(function (arrStrData) {
            if (arrStrData[1] && arrStrData[1].slice(0,8)==="CONFLICT") {
                //$state.go('merge-failure')
            } else if (arrStrData[0].slice(0,7)==="Already") {
                 $scope.mergeOutcome = arrStrData;
            } else if (arrStrData[0] === "error: 'merge' is not possible because you have unmerged files.") {
                $state.go('commit_final')
            } else {
                //$state.go('merge-success')
            }
            
        })
        .catch(function (conflict) {
            $scope.conflictFiles = conflict
        })
    	// console.log($rootScope.repo.path)
     //    mergeFactory.getRepo($rootScope.repo.path)
     //    	.then(mergeFactory.getBranchCommit)
     //    	.then(mergeFactory.getMasterCommit)
     //    	.then(mergeFactory.mergeCommits)
     //    	.then(mergeFactory.addToIndex)
     //    	.then(mergeFactory.postMergeCommit)
     //    	// .then(function (repo) {
     //    	// 	console.log('got here', repo)
     //    	// })
     //        .then(function (repo) {
     //            $scope.mergeSuccess = true;
     //        })
     //    	.catch(function (err) {
     //            console.log(err)
     //            if (err.message === 'This merge has conflicts') {
     //                console.log("we made it past the if statement")
     //                mergeFactory.getConflicts()
     //                    .then(function (conflictFiles) {
     //                        $scope.conflictFiles = conflictFiles
     //                        $scope.mergeErr = err.message
     //                })
     //            } else {
     //                $scope.mergeErr = err.message
     //            }
        		
     //    	})
        	
        	

        
    }

    $scope.findConflicts = function () {
    	//mergeFactory.findConflicts()
    	mergeFactory.getConflicts()
    }


});