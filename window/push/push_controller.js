app.controller('PushCtrl', function ($scope, $rootScope, branchFactory) {

    $scope.push = function () {

        $rootScope.repo.remote_push("origin", branchFactory.currentBranch, function(err) {
            if (err) throw err;
            console.log("Branch pushed");
        })
    }
});
