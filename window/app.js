'use strict';

var app = angular.module('GitWork', []);
var NodeGit = require("nodegit");

app.controller('MainController', function ($scope, cloneFactory) {

    $scope.cloneRepo = function (repoUrl) {
        cloneFactory.cloneRepo(repoUrl)
        $scope.repoUrl = ''
    }


});


app.factory('cloneFactory', function(){
    
    return {
        cloneRepo: function(url){
            console.log(url)
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
        }
    }

})


