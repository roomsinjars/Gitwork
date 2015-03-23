app.controller('RepoCtrl', function ($scope, repoFactory) {

    $scope.checkRepo = function(){
        fs.readdir('./', function(err,data){
            if (err) throw err;
            for (var i=0; i<data.length; i++){
                if (data[i]===".git") return false;
            }
        })
        return true;
    }

    $scope.repo;


    $scope.cloneRepo = function (repoUrl) {
        repoFactory.cloneRepo(repoUrl).then(function (repo) {
            $scope.repo = repo
        })
        $scope.repoUrl = ''
    }

    $scope.createRepo = function (repoName) {
        repoFactory.createRepo(repoName).then(function (repo) {
            $scope.repo = repo
        })
        $scope.repoName = ''
    }
    $scope.commit = function () {
        repoFactory.commit($rootScope.repo, commitMsg)
    }

});