app.controller('PullCtrl', function ($scope, $rootScope, pullFactory) {

    $scope.pullRepo = function () {
        pullFactory.pullRepo()
    }
});