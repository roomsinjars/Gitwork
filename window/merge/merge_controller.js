app.controller('MergeCtrl', function ($scope, repoFactory, $rootScope) {

    $scope.merge = function () {
        repoFactory.merge()
    }


});