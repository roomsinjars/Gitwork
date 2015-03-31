app.controller('HomeController', function ($scope, $state, $rootScope) {

    $scope.changeStateNoRepo = function() {
        $state.reload();
        $state.go('noRepo')
    };

    $scope.changeStateBranch = function() {
        // $rootScope.repo = git(process.env.PWD);
        // console.log($rootScope.repo);
        $state.reload();
        $state.go('branch')

    };

});



