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
var install = require('./install.json');

app.config(function ($urlRouterProvider, $locationProvider) {
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('branch', {
            url: '/branch',
            templateUrl: 'window/branch/branch.html',
            controller: 'BranchCtrl'
        })
});
app.controller('BranchCtrl', function ($scope, $state, $rootScope, repoFactory) {
   console.log("root", $rootScope.repo);
  fs.readdir(__dirname + '/.git/refs/heads', function(err,data){
    if (err) throw err;
    $scope.branches = data;
    $scope.$digest();
  })
  	// $scope.createBranch = function (branchName) {
   //      repoFactory.createBranch(branchName)
        
   //      ;
   //    }

  $scope.switch = function(branchName) {
	  $rootScope.repo.checkout(branchName, function (err) {
	   if (err) throw err;
	   console.log(branchName);
	  })
  }

  $scope.newBranch = function(branchName) {
  	$rootScope.repo.create_branch(branchName, function (err){
  		if (err) throw err;
      $rootScope.branchName = branchName;
      $scope.branchName = ''
  		$scope.switch(branchName);

  	})
  }
});
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('commit', {
            url: '/commit',
            templateUrl: 'window/commit/commit.html',
            controller: 'CommitCtrl'
        })
});
app.controller('CommitCtrl', function ($scope, $state, $rootScope, repoFactory) {

	$scope.commit = function (commitMsg) {
		repoFactory.commit($rootScope.repo, commitMsg)
	}

});
app.controller('CommitCtrl', function ($scope, $state, $rootScope, repoFactory) {

	$scope.commit = function (commitMsg) {
		repoFactory.commit($rootScope.repo, commitMsg)
	}

});
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('commit_final', {
            url: '/commit_final',
            templateUrl: 'window/commit_final/commit_final.html',
            controller: 'CommitCtrl'
        })
});
app.factory('fileSystemFactory', function ($rootScope){
	return {
		makeDir: function (name, cb) {
			var filePath = __dirname + '/' + name;
			mkdirp(filePath, function (err) {
				console.log('into the makeDir function')
			    if (err) throw err;
			})
		},
		makeDotGitDir: function (name) {
			var filePath = __dirname + '/' + name + '/.git';
			mkdirp(filePath, function (err) {
				console.log('into the makeDotGitDir function')
			    if (err) throw err;
			})
		},
		makeFile: function (dirName, fileName, fileType) {
			var filePath = __dirname + '/' + dirName + '/' + fileName;
			fs.writeFile(filePath, fileName, function(err) {
			    console.log('into write file function')
			    if(err) throw err
			})
		}
	}
});
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'window/home/home.html',
            controller: 'HomeController'
        })
});

app.controller('HomeController', function ($scope, $state, $rootScope) {

    $scope.changeStateNoRepo = function() {
        $state.reload();
        $state.go('noRepo')
    };

    $scope.changeStateBranch = function() {
        $rootScope.repo = git(process.env.PWD);
        console.log($rootScope.repo);
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

app.factory('homeFactory', function ($rootScope){
    
  return {
}
 
})
if (process.platform === "darwin") {
    var mb = new gui.Menu({type: 'menubar'});
    mb.createMacBuiltin('RoboPaint', {
        hideEdit: false
    });
    gui.Window.get().menu = mb;
}
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('merge', {
            url: '/merge',
            templateUrl: 'window/merge/merge.html',
            controller: 'MergeCtrl'
        })
});

app.controller('MergeCtrl', function ($scope, repoFactory, $rootScope) {

    $scope.merge = function () {
        repoFactory.merge()
    }


});
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('merge_ready', {
            url: '/merge_ready',
            templateUrl: 'window/merge_ready/merge_ready.html'
        })
});

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('push', {
            url: '/push',
            templateUrl: 'window/push/push.html',
        })
});
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('noRepo', {
            url: '/noRepo',
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
                  git.init(__dirname+'/'+name, function (err, _repo) {
                      var giftRepo = _repo
                      console.log(giftRepo)
                      $rootScope.repo = giftRepo
                      fs.writeFile(__dirname+'/'+name + '/README.md', "README", function(err) {
                          if(err) throw err
                          $rootScope.repo.add('README.md', function (err) {
                             if (err) throw err;
                             var author = "blakeprobinson <bprobinson@zoho.com>";
                             $rootScope.repo.identify(author, function (err) {
                                console.log('entered identify function')
                                console.log('post-identify repo', $rootScope.repo.identity)
                                var options = {
                                all: true,
                                amend: false,
                                author: "blakeprobinson <bprobinson@zoho.com>"
                                }
                                 $rootScope.repo.commit("Initial Commit", options, function (err) {
                                    if (err) throw err;
                                })
                             })                             
                          })
                      });   
                  })

                })
            })
        },

        createBranch: function(branchName) {
            $rootScope.repo.create_branch(branchName, function (err) {
                if (err) throw err;
                $rootScope.repo.checkout(branchName, function (err) {
                    if (err) throw err
                })  

            })
        },
        commit: function (repository, commitMsg) {
            var options = {
            all: true,
            amend: false,
            author: "blakeprobinson <bprobinson@zoho.com>"
            }
            repository.commit(commitMsg, options, function (err) {
                if (err) throw err;
            })
        }, 
        merge: function () {
            var ourSignature = NodeGit.Signature.now("blakeprobinson",
              "bprobinson@zoho.com");
            console.log($rootScope.repo.path)
            NodeGit.Repository.open($rootScope.repo.path)
                .then(function(repository) {
                    return repository.getBranchCommit('test')
                .then(function (commitBranch) {
                    return repository.getBranchCommit('master')
                .then(function (commitMaster) {
                        console.log('commitBranch', commitBranch);
                        console.log('commitMaster', commitMaster);
                    return NodeGit.Merge.commits(repository, commitBranch, commitMaster)
                .then(function (index) {
                    if (!index.hasConflicts()) {
                        index.write();
                        console.log('this is the index', index)
                        return index.writeTreeTo(repository);
                    }
                    })
                .then(function (oid) {
                    console.log('this is the oid', oid)
                    return repository.createCommit('HEAD', ourSignature,
                        ourSignature, "we merged their commit", oid, [commitBranch, commitMaster]);
                })
                .done(function (commitId) {
                    console.log("New Commit: ", commitId);
                })
                    })
                })
            });
        }
    }

})

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('work', {
            url: '/work',
            templateUrl: 'window/work/work.html'
        })
});


app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/common/navbar/navbar.html'
    };

});






