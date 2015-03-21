'use strict';

var app = angular.module('GitWork', ['ui.router']);


app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'window/directives/home/home.html',
            controller: 'MainController'
        })

});

//app.constant() put in path--process.env.PWD;






app.controller('MainController', function ($scope, repoFactory, $rootScope) {
    var fs = require("fs");

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
        repoFactory.createRepo(repoName)
        $rootScope.repoName = repoName;
        $scope.repoName = '';


    }
    $scope.commit = function () {
        repoFactory.commit($rootScope.repo, $rootScope.repoName)
    }


});


app.factory('repoFactory', function ($rootScope){
    var NodeGit = require("nodegit");
    var fs = require("fs");
    var path = require("path");
    var promisify = require("promisify-node");
    var fse = promisify(require("fs-extra"));

    
    return {

        cloneRepo: function(url){
            var __dirname = process.env.PWD;
            var cloneURL = url;
            var repoName = url.split('/').pop()
            var localPath = require("path").join(__dirname, repoName);
            var cloneOptions = {};

            var errorAndAttemptOpen = function() {
              return NodeGit.Repository.open(local);
            };

            cloneOptions.remoteCallbacks = {
              certificateCheck: function() { return 1; }
            };

            var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);

            return cloneRepository.catch(errorAndAttemptOpen)
              .then(function(repository) {
                    return repository
                console.log("Is the repository bare? %s", Boolean(repository.isBare()));
              });
        },
        createRepo: function (name) {
            // var __dirname = process.env.PWD;
            // var pathToRepo = require("path").resolve(__dirname + '/' + name);
            // var isBare = 0; // lets create a .git subfolder
            
            var fileName = "README.md";
            var fileContent = "README";
            var __dirname = process.env.PWD;
            var repoDir = require("path").resolve(__dirname + '/' + name);

            fse.ensureDir = promisify(fse.ensureDir);

            var repository;
            var index;

            fse.ensureDir(path.resolve(__dirname, repoDir))
            .then(function() {
              return NodeGit.Repository.init(path.resolve(__dirname, repoDir), 0);
            })
            .then(function(repo) {
              repository = repo;
              $rootScope.repo = repo;
              console.log($rootScope.repo)
              return fse.writeFile(path.join(repository.workdir(), fileName), fileContent);
            })
            .then(function(){
              return repository.openIndex();
            })
            .then(function(idx) {
              index = idx;
              return index.read(1);
            })
            .then(function() {
              return index.addByPath(fileName);
            })
            .then(function() {
              return index.write();
            })
            .then(function() {
              return index.writeTree();
            })
            .then(function(oid) {
              var author = NodeGit.Signature.create("Scott Chacon",
                "schacon@gmail.com", 123456789, 60);
              var committer = NodeGit.Signature.create("Scott A Chacon",
                "scott@github.com", 987654321, 90);

              // Since we're creating an inital commit, it has no parents. Note that unlike
              // normal we don't get the head either, because there isn't one yet.
              return repository.createCommit("HEAD", author, committer, "Initial Commit", oid, []);
            })
            .done(function(commitId) {
              console.log(commitId);
            });
            //Couldn't figure out how to make this function return a promise for the 
            //value of the commitId.
        },
        commit: function (repository, repoName) {
            var repo = repository;
            var fileName = "newfile.txt";
            var fileContent = "hello world";
            var directoryName = "./";
            var __dirname = process.env.PWD;
            // ensureDir is an alias to mkdirp, which has the callback with a weird name
            // and in the 3rd position of 4 (the 4th being used for recursion). We have to
            // force promisify it, because promisify-node won't detect it on its
            // own and assumes sync
            fse.ensureDir = promisify(fse.ensureDir);

            /**
             * This example creates a certain file `newfile.txt`, adds it to the git
             * index and commits it to head. Similar to a `git add newfile.txt`
             * followed by a `git commit`
            **/

            var repo;
            var index;
            var oid;
            console.log(repoName)
            console.log('filepath to open for commit', __dirname + '/' + repoName)
            NodeGit.Repository.open(path.resolve(__dirname + '/' + repoName))
            .then(function(repoResult) {
              repo = repoResult;
              console.log('opened repo', repo)
              return fse.ensureDir(path.join(repo.workdir(), directoryName));
            }).then(function(){
              return fse.writeFile(path.join(repo.workdir(), fileName), fileContent);
            })
            .then(function() {
              return fse.writeFile(
                path.join(repo.workdir(), directoryName, fileName),
                fileContent
              );
            })
            .then(function() {
              return repo.openIndex();
            })
            .then(function(indexResult) {
              index = indexResult;
              return index.read(1);
            })
            .then(function() {
              // this file is in the root of the directory and doesn't need a full path
              return index.addByPath(fileName);
            })
            .then(function() {
              // this file is in a subdirectory and can use a relative path
              return index.addByPath(path.join(directoryName, fileName));
            })
            .then(function() {
              // this will write both files to the index
              return index.write();
            })
            .then(function() {
              return index.writeTree();
            })
            .then(function(oidResult) {
              oid = oidResult;
              return NodeGit.Reference.nameToId(repo, "HEAD");
            })
            .then(function(head) {
              return repo.getCommit(head);
            })
            .then(function(parent) {
              var author = NodeGit.Signature.create("Blake Robinson",
                "bprobinson@zoho.com", 123456789, 60);
              var committer = NodeGit.Signature.create("Blake Robinson",
                "bprobinson@zoho.com", 987654321, 90);

              return repo.createCommit("HEAD", author, committer, "message", oid, [parent]);
            })
            .done(function(commitId) {
              console.log("New Commit: ", commitId);
            });
        }

    }

})


