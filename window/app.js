'use strict';

var app = angular.module('GitWork', []);
var NodeGit = require("nodegit");

app.controller('MainController', function ($scope, cloneFactory) {

    $scope.cloneRepo = function (repoUrl) {
        cloneFactory.cloneRepo(cloneUrl)
        console.log("test")
    }


});

app.factory('cloneFactory', function(){
    
    return {
        cloneRepo: function(url){
            var __dirname = "repos"
            var cloneURL = url;
            var repoName = function (url){
                    return url.split('/').pop()
                }
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


            return $http.post('/api/admin/itemCreate', data)
                .then(function(response){
                    return response.data;
            })
        }
    }

})

app.directive('home', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/directives/home/home.html'
    };

});

app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/directives/common/navbar/navbar.html'
    };

});