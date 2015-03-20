'use strict';

var app = angular.module('GitWork', ['ui.router']);
var NodeGit = require("nodegit");

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'window/directives/home/home.html',
            controller: 'MainController'
        })

});







app.controller('MainController', function ($scope, repoFactory) {

    $scope.cloneRepo = function (repoUrl) {
        repoFactory.cloneRepo(repoUrl)
        $scope.repoUrl = ''
    }

    $scope.createRepo = function (repoName) {
        repoFactory.createRepo(repoName)
        $scope.repoName = ''
    }


});

app.factory('repoFactory', function(){
    
    return {
        cloneRepo: function(url){
            var __dirname = "repos"
            var cloneURL = url;
            var repoName = url.split('/').pop()
        
            console.log(repoName)
            var localPath = require("path").join(__dirname, repoName);
            var cloneOptions = {};

            var errorAndAttemptOpen = function() {
              return NodeGit.Repository.open(local);
            };

            cloneOptions.remoteCallbacks = {
              certificateCheck: function() { return 1; }
            };

            var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);

            cloneRepository.catch(errorAndAttemptOpen)
              .then(function(repository) {
                // Access any repository methods here.
                console.log("Is the repository bare? %s", Boolean(repository.isBare()));
              });
        },
        createRepo: function (name) {
            var pathToRepo = require("path").resolve("./repos/" + name);
            var isBare = 0; // lets create a .git subfolder

            NodeGit.Repository.init(pathToRepo, isBare).then(function (repo) {
              // In this function we have a repo object that we can perform git operations
              // on.

              // Note that with a new repository many functions will fail until there is
              // an initial commit.
            });
        }
    }

})

