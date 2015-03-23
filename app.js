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

    $scope.checkRepo = function () {
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
    $scope.addFilesToIndex = function () {
      repoFactory.addFiles($rootScope.repoName)
    }


});


app.factory('repoFactory', function ($rootScope){
    var NodeGit = require("nodegit");
    var fs = require("fs");
    var path = require("path");
    var promisify = require("promisify-node");
    var fse = promisify(require("fs-extra"));
    var __dirname = process.env.PWD;
    var git = require("gift");
    var mkdirp = require('mkdirp');
    
    // console.log(giftRepo)

    
    return {

        getChangedFiles: function () {
            fs.readdir(__dirname, function(err,data){

                if (err) throw err;
                    for (var i=0; i<data.length; i++){
                        if (data[i]!==".git") {

                        };
                    }
                })
            return true;
        },

        pull: function () {

          var repoDir = "../../test";

          var repository;

          // Open a repository that needs to be fetched and fast-forwarded
          NodeGit.Repository.open(path.resolve(__dirname, repoDir))
            .then(function(repo) {
              repository = repo;

              return repository.fetchAll({
                credentials: function(url, userName) {
                  return NodeGit.Cred.sshKeyFromAgent(userName);
                },
                certificateCheck: function() {
                  return 1;
                }
              });
            })
            // Now that we're finished fetching, go ahead and merge our local branch
            // with the new one
            .then(function() {
              return repository.mergeBranches("master", "origin/master");
            })
            .done(function() {
              console.log("Done!");
            });
        },

        addFiles: function (repoName) {
            var Promise = require("nodegit-promise");

            NodeGit.Repository.open(path.resolve(__dirname + '/' + repoName))
              .then(function(repo) {
                return repo.openIndex()
                .then(function(index) {
                  var fileContent = {
                    newFile1: "this has some content",
                    newFile2: "and this will have more content"
                  };
                  var fileNames = Object.keys(fileContent);

                  return Promise.all(fileNames.map(function(fileName) {
                    fse.writeFile(
                      path.join(repo.workdir(), fileName), fileContent[fileName]);
                  }))



                    // This will add all files to the index
                  .then(function() {
                    return index.addAll();

                  })
                  .then(function() {
                    var newFiles = index.entries().filter(function(entry) {
                      return ~fileNames.indexOf(entry.path);
                    });

                    console.log(
                      "\n-------------------\n" +
                      "Added files: " +
                      "\n-------------------\n");
                    newFiles.forEach(function(entry) {
                      console.log(entry.path);
                    });
                  })
                  // .then(function() {
                  //   // This will remove the files from the index
                  //   return index.removeAll("newFile*");
                  // })
                  // .then(function() {
                  //   var newFiles = index.entries().filter(function(entry) {
                  //     return ~fileNames.indexOf(entry.path);
                  //   });

                  //   console.log("New files in index: " + newFiles.length);
                  // })



                  // We can also provide a pattern to add files to the index
                  // .then(function() {
                  //   return index.addAll("newFile*");
                  // })
                  // .then(function() {
                  //   var newFiles = index.entries().filter(function(entry) {
                  //     return ~fileNames.indexOf(entry.path);
                  //   });

                  //   console.log(
                  //     "\n-------------------\n" +
                  //     "Added files with pattern: " +
                  //     "\n-------------------\n");
                  //   newFiles.forEach(function(entry) {
                  //     console.log(entry.path);
                  //   });
                  // })
                  // .then(function() {
                  //   // We're also using the pattern in the remove
                  //   return index.removeAll("newFile*");
                  // })
                  // .then(function() {
                  //   var newFiles = index.entries().filter(function(entry) {
                  //     return ~fileNames.indexOf(entry.path);
                  //   });

                  //   console.log("New files in index: " + newFiles.length);
                  // })



                  // Callbacks can be used for a finer degree of control over what
                  // we add to the index
                  // .then(function() {
                  //   return index.addAll(
                  //     "newFile*",
                  //     NodeGit.Index.ADD_OPTION.ADD_CHECK_PATHSPEC,
                  //     function(path, matchedPattern) {
                  //       if (path == "newFile1") {
                  //         return 0; // add the file
                  //       }

                  //       return 1; // skip the file
                  //     });
                  // })
                  // .then(function() {
                  //   var newFiles = index.entries().filter(function(entry) {
                  //     return ~fileNames.indexOf(entry.path);
                  //   });

                  //   console.log(
                  //     "\n-------------------\n" +
                  //     "Added files with callback: " +
                  //     "\n-------------------\n");
                  //   newFiles.forEach(function(entry) {
                  //     console.log(entry.path);
                  //   });
                  // })
                  // .then(function() {
                  //   // Lets use a callback in the remove as well
                  //   return index.removeAll(null, function(path) {
                  //     if (~path.indexOf("newFile")) {
                  //       return 0; // remove the file
                  //     }

                  //     return 1; // don't remove the file
                  //   });
                  // })
                  // .then(function() {
                  //   var newFiles = index.entries().filter(function(entry) {
                  //     return ~fileNames.indexOf(entry.path);
                  //   });

                  //   console.log("Total: " + index.entries().length);
                  //   console.log("New files in index: " + newFiles.length);
                  // });
                });
              }).done(function() {
                console.log("All done!");
              });
        },

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
                  git.init(__dirname+'/'+name+ '/'+'.git', true, function (err, _repo) {
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


