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
        //npm link on the current directory
        var exec = require('child_process').exec;
        exec('npm link', function(error,stdout){
            console.log('installed', stdout);
            fs.writeFile('install.json', '{"value": "true"}', function(err){
                if (err) throw err;
                console.log('done');
            })
        })
    }
    fs.readdir(__dirname, function(err,data){
        if (err) throw err;
        for (var i=0; i<data.length; i++){
            if (data[i]===".git") return $scope.changeStateBranch();
        }
        return $scope.changeStateNoRepo();
    })
});
