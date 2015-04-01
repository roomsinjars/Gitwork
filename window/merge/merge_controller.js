app.controller('MergeCtrl', function 
    ($scope, repoFactory, $rootScope, mergeFactory, $state, branchFactory, pullFactory) {
    $scope.merge = function () {        

        branchFactory.switchBranch('master').then(function (data) {
            return pullFactory.pullRepo()
        })
        .then(function (data) {
            return branchFactory.switchBranch(branchFactory.currentBranch)
        })
        .then(function (data) {
            return mergeFactory.mergeExec()
        })
        .then(function (arrStrData) {
            if (arrStrData[1] && arrStrData[1].slice(0,8)==="CONFLICT") {
                $scope.mergeConflicts = arrStrData
            } else if (arrStrData[0].slice(0,7)==="Already") {
                 $scope.alreadyMerged = arrStrData;
            } else {
                $state.go('merge-success')
            }    
        })
        .catch(function (errArr) {
            if (errArr[1] === "error: 'merge' is not possible because you have unmerged files.") {
                console.log('this is the errArr in the dotCatch', errArr)
                $scope.mergeErr = errArr
            }
        })

    }

    $scope.findConflicts = function () {
    	//mergeFactory.findConflicts()
    	mergeFactory.getConflicts()
    }


});