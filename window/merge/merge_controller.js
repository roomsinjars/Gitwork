app.controller('MergeCtrl', function ($scope, repoFactory, $rootScope, mergeFactory) {

    $scope.merge = function () {
        mergeFactory.merge()
        $scope.mergeConflictError = repoFactory.mergeConflictError
    }


});