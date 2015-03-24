var app = angular.module('GitWork', ['ui.router']);
var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require("fs");
var NodeGit = require("nodegit");
var path = require("path");
var promisify = require("promisify-node");
var fse = promisify(require("fs-extra"));
var __dirname = process.env.PWD;
var git = require("gift");
var mkdirp = require('mkdirp');

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('branch', {
            url: '/',
            templateUrl: 'window/branch/branch.html',
            controller: 'BranchCtrl'
        })
});
app.controller('BranchCtrl', function ($scope) {
    $scope.branchNames = [
    {name: 'master'},
    {name: 'myFeature'}
    ]
});
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'window/home/home.html',
            controller: 'HomeController'
        })
});

app.controller('HomeController', function ($scope, $state) {

    $scope.changeStateNoRepo = function() {
        $state.reload();
        $state.go('noRepo')
    };

    $scope.changeStateBranch = function() {
        $state.reload();
        $state.go('branch')

    };

    fs.readdir(__dirname, function(err,data){
        if (err) throw err;
        for (var i=0; i<data.length; i++){
            if (data[i]===".git") return $scope.changeStateBranch();
        }
        return $scope.changeStateNoRepo();
    })

});

if (process.platform === "darwin") {
    var mb = new gui.Menu({type: 'menubar'});
    mb.createMacBuiltin('RoboPaint', {
        hideEdit: false
    });
    gui.Window.get().menu = mb;
}
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('noRepo', {
            url: '',
            templateUrl: 'window/repository/repository.html',
            controller: 'RepoCtrl'
        })
});

app.controller('RepoCtrl', function ($scope, repoFactory, $rootScope) {

    $scope.repo;


    $scope.cloneRepo = function (repoUrl) {
        repoFactory.cloneRepo(repoUrl)
        $scope.repoUrl = ''
    }

    $scope.createRepo = function (repoName) {
        repoFactory.createRepo(repoName)
        $rootScope.repoName = repoName;
        $scope.repoName = '';


    }
    $scope.commit = function (commitMessage) {
        repoFactory.commit(commitMessage, $rootScope.repo, $rootScope.repoName)
    }
    $scope.createBranch = function (branchName) {
      repoFactory.createBranch(branchName)
      $scope.branchName = ''
    }

});
app.factory('repoFactory', function ($rootScope){
    
    return {

        cloneRepo: function(url){
            var cloneURL = url;
            var repoName = url.split('/').pop()
            var localPath = require("path").join(__dirname, repoName);
            
            mkdirp(__dirname + '/' + repoName, function (err) {
                git.clone(cloneURL, localPath, function (err, _repo) {
                    if (err) throw err;
                    var giftRepo = _repo
                    console.log(giftRepo)
                    $rootScope.repo = giftRepo
                    console.log('this is the rootScope.repo', $rootScope.repo)
                })
            })                  
        },
        createRepo: function (name) {
            mkdirp(__dirname + '/' + name, function (err) {
                if (err) throw err;
                mkdirp(__dirname + '/' + name + '/'+'.git', function (err) {
                  if (err) throw err;
                  git.init(__dirname+'/'+name, true, function (err, _repo) {
                      var giftRepo = _repo
                      console.log(giftRepo)
                      $rootScope.repo = giftRepo
                  })

                })
            })
        },

        createBranch: function(branchName) {
            $rootScope.repo.create_branch(branchName, function (err) {
                if (err) throw err;
            })
        },
        commit: function (commitMessage, repository, repoName) {

            giftRepo.commit(commitMessage, true, function (err) {
                if (err) throw err;
            })

        }

    }

})

app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/common/navbar/navbar.html'
    };

});






