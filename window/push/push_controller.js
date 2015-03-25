app.controller('PushCtrl', function ($scope, $rootScope) {

    $scope.push = function () {
        console.log($rootScope.repo)

        $rootScope.repo.remote_push(hold, function (err) {
            if (err) throw err;
            console.log("got here");
            console.log(hold);
        })
    }
});
