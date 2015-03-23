app.controller('HomeController', function ($scope, $state) {

    $scope.changeStateNoRepo = function() {
        $state.reload();
        $state.go('noRepo')
    };

    $scope.changeStateBranch = function() {
        $state.reload();
        $state.go('branch')

    };

    fs.readdir('./repos', function(err,data){
        if (err) throw err;
        for (var i=0; i<data.length; i++){
            if (data[i]===".git") return $scope.changeStateBranch();
            console.log(i, data[i]);
        }
        return $scope.changeStateNoRepo();
    })

});
