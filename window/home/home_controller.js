app.controller('HomeController', function ($scope, $state) {

    $scope.changeStateNoRepo = function() {
        $state.reload();
        $state.go('noRepo')
    };

    $scope.changeStateBranch = function() {
        $state.reload();
        $state.go('branch')

    };
    console.log("HomeController", install.value);
    if (install.value==="false") {
        
        console.log("got here");
    }

    fs.readdir(__dirname, function(err,data){
        if (err) throw err;
        for (var i=0; i<data.length; i++){
            if (data[i]===".git") return $scope.changeStateBranch();
        }
        return $scope.changeStateNoRepo();
    })
});
