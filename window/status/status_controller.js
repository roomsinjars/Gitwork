app.controller('StatusCtrl', function ($scope, repoFactory, $rootScope) {

    $scope.status = function () {
        repoFactory.status($rootScope.repo)
        $scope.statusObject = repoFactory.statusObject
        console.log($scope.statusObject)
    }



});