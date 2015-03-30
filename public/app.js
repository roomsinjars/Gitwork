var app = angular.module('GitWork', ['ui.router', 'ngAnimate']);
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
var recursive = require('recursive-readdir');
var async = require ('async');
var spawn = require('child_process').spawn

app.config(function ($urlRouterProvider, $locationProvider) {
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

app.run(function ($state, $rootScope) {
	fs.readdir(__dirname, function (err,data){
	    if (err) throw err;
	    for (var i=0; i<data.length; i++){
	        if (data[i]===".git") {
		        $rootScope.repo = git(process.env.PWD);		    	
		    	console.log($rootScope.repo);
		    	$rootScope.repo.config(function (err, config) {
		    		console.log(config.items)
		    		$rootScope.username = config.items['user.name'];
		    		$rootScope.useremail = config.items['user.email'];
		    		console.log($rootScope)
		    		return $state.go('branch')
		    	})
	    	}
	    }
	    return $state.go('noRepo')
	})

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

})
app.factory('fsFactory', function ($rootScope, $q){
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
		},
		findFilesInDir: function (path, arrToIgnore) {
			return $q(function (resolve, reject) {
				if (!arrToIgnore) {
					recursive(path, function (err, files) {
						if (err) return reject(err)
						resolve(files)
				});
				} else {
					recursive(path, arrToIgnore, function (err, files) {
						if (err) return reject(err)
						resolve(files)
					})
				}	
			})	
		}, 
		readFile: function (file) {
			return $q(function (resolve, reject) {
				fs.readFile(file, 'utf-8', function (err, contents) {
					if (err) return reject(err);
					resolve(contents)			    		 
				});
			})
		},
		findInFile: function(str) {
			var conflict;
			return $q(function (resolve, reject) {
				if (str.indexOf('<<<<<<< HEAD') != -1) {
		        conflict = true;
			    } else { conflict = false; }
			    resolve(conflict)
			})
			
		},
		arrayMap: function (array, func) {
			var promises = array.map(func);
			return $q.all(promises);
		}
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
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('branch', {
            url: '/branch',
            templateUrl: 'window/branch/branch.html',
            controller: 'BranchCtrl',
            resolve: {
 							branches: function(branchFactory){
 								return branchFactory.getAllBranches().then(function(data){
 									return data; 
 								}, function failed(err){
 									return err; 
 								})
 							}
            }
        })
});
app.controller('BranchCtrl', function ($scope, $state, $rootScope, branches, branchFactory) {

  console.log('branches: ', branches);

  $scope.branches = branches;

  console.log($scope.branches);


  $scope.switch = function (branchName) {
  	branchFactory.switchBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }

  $scope.newBranch = function(branchName) {
  	branchFactory.createNewBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }


});
app.factory('branchFactory', function ($rootScope, $q){
	return {

		switchBranch: function(branchName) {
		  $rootScope.repo.checkout(branchName, function (err) {
		   if (err) throw err;
		  })
		},

		createNewBranch: function(branchName) {
			$rootScope.repo.create_branch(branchName, function (err){
				if (err) throw err;
				$scope.switch(branchName);
			})
		},

		getAllBranches: function(){
			return $q(function (resolve, reject){
				fs.readdir(__dirname + '/.git/refs/heads', function(err, data){
					if (err) return reject(err);
	        resolve(data)
	      })
			})
		},

		currentBranch: ""

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
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('merge_ready', {
            url: '/merge_ready',
            templateUrl: 'window/merge_ready/merge_ready.html',
            controller: 'PullCtrl'
        })
});

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('merge', {
            url: '/merge',
            templateUrl: 'window/merge/merge.html',
            controller: 'MergeCtrl'
        })
});

app.controller('MergeCtrl', function ($scope, repoFactory, $rootScope, mergeFactory) {
	console.log(mergeFactory)
    $scope.merge = function () {
        mergeFactory.merge()
        $scope.mergeConflictError = repoFactory.mergeConflictError
    }

    $scope.findConflicts = function () {
    	//mergeFactory.findConflicts()
    	mergeFactory.getConflicts()
    }


});
app.factory('mergeFactory', function ($rootScope, $q, branchFactory, fsFactory) {
	var self = this;
	console.log('this is this', this)
	return {
		
		merge: function () {
			var closure = {};
	    var ourSignature = NodeGit.Signature.now($rootScope.username,
	      $rootScope.useremail);
	    NodeGit.Repository.open($rootScope.repo.path)
	        .then(function(repository) {
	            if (branchFactory.currentBranch !== 'master') {
	                closure.repo = repository
	                return closure.repo.getBranchCommit(branchFactory.currentBranch)
	            } else {
	                throw new Error('You should not merge master into master')
	            }
	            })                    
	        .then(function (commitBranch) {
	        	console.log('this is the commit Branch', commitBranch.repo)
	        	closure.commitBranch = commitBranch
	            return closure.repo.getBranchCommit('master')	            	
	           	})
	        .then(function (commitMaster) {
	        	closure.commitMaster = commitMaster
	            return NodeGit.Merge.commits(closure.repo, closure.commitBranch, closure.commitMaster)
	        })
	        .then(function (index) {
	            if (!index.hasConflicts()) {
	                index.write();
	                console.log('this is the index', index)
	                return index.writeTreeTo(closure.repo);
	            } else {
	                //on branch...findInFiles('<<<<<<<<master')
	                //$Q is the promise library for angular
	                throw new Error('This merge has conflicts')
	                //get user to fix merge conflicts before writing
	                //to tree...
	            }   
	            })
	        .then(function (oid) {
	            console.log('this is the oid', oid)
	            return closure.repo.createCommit('HEAD', ourSignature,
	                ourSignature, "we merged their commit", oid, [closure.commitBranch, closure.commitMaster]);
	        })
	        .catch(function(error) {
	            $rootScope.mergeConflictError = error;
	            console.log($rootScope.mergeConflictError)
	            this.mergeConflictError(error)
	        })
	        .done(function (commitId) {
	            if (commitId) {
	                console.log("New Commit: ", commitId);
	            }
	            
	        });
		},
		// findConflicts: function () {
		// 	var closure = {}
		// 	fsFactory.findFilesInDir($rootScope.repo.path +'/test', ['.git'])
		// 		.then(function (files) {
		// 			self.getConflicts()
		// 			closure.files = files
		// 			console.log('these are the files', closure.files)
		// 			return fsFactory.arrayMap(files, fsFactory.readFile);
		// 		})
		// 		.then(function (arrayOfContents) {
		// 			closure.contents = arrayOfContents
		// 			return fsFactory.arrayMap(arrayOfContents, fsFactory.findInFile)
		// 		})
		// 		.then(function (arrayOfBooleans) {
		// 			closure.booleans = arrayOfBooleans
		// 			closure.conflictFiles = []
		// 			var booleanIndex = 0;
		// 			console.log('this is the array of Booleans', closure.booleans)
		// 			for (var i = 0, len = arrayOfBooleans.length; i < len; i++) {
		// 				if (arrayOfBooleans[i]) {
		// 					closure.conflictFiles.push(closure.contents[i])
		// 				}
		// 			}
		// 			console.log(closure.conflictFiles)
		// 		})
		// },
		getConflicts: function () {
			return $q(function (resolve, reject) {
				var git = spawn('git', ['diff-files', '--name-only']);
				git.stdout.on('data', function (data) {
				  var strData = ''+ data;
				  var arrStrData = [];
				  console.log('this is the raw data', strData);
				  var len = arrStrData.length;
				  arrStrData = strData.split("\n").slice(0, len-1)
				  console.log(arrStrData)
				  if (arrStrData.length >=1) {
				  		resolve(arrStrData)
				  } else {
				  	  var error = 'No files are in conflict';
				  	  reject(error)
				  }
				  
				});
			})
		}

	}
});
app.controller('PullCtrl', function ($scope, $rootScope, pullFactory) {

    $scope.pullRepo = function () {
        pullFactory.pullRepo()
    }
});
app.factory('pullFactory', function ($rootScope){

    return {
        pullRepo: function(){
          $rootScope.repo.remote_fetch("", function(err){
              if (err) throw err;
              console.log("fetched repo")
          })
        }
    }
});

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('status', {
            url: '/status',
            templateUrl: 'window/status/status.html',
            controller: 'StatusCtrl'
        })
});
app.controller('StatusCtrl', function ($scope, repoFactory, $rootScope) {

    $scope.status = function () {

        repoFactory.status($rootScope.repo, function (statusObj) {
        	var array = []
	        	var counter = 0
	        	for (var key in statusObj) {
	        		if (statusObj.hasOwnProperty(key)) {
	        	   		array[counter] = {};
	        	   		array[counter].fileName = key;
	        	        for (var prop in statusObj[key]) {
	        	        	if(statusObj[key].hasOwnProperty(prop)){
	        	        	    if (prop === 'staged') {
	        	        		    array[counter].staged = statusObj[key][prop]
	        	        	    } else {
	        	        	        array[counter].tracked = statusObj[key][prop]
	        	        	    }
	        	          }
	        	       }
	        	    }counter++
	        	}
	        	$scope.files = array
	        	$scope.$digest();
	        	console.log('this is scope.files', $scope.files)
        })
    }

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
app.factory('repoFactory', function ($rootScope, $q, branchFactory){

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
        statusObject: function (statusObject) {
            return statusObject
        },

        status: function (repo, cb) {
            console.log('this is the repo object', repo)
            repo.status(function (err, status) {
                console.log(status.files)
                cb(status.files)
            })
        }
    }

})

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('work', {
            url: '/work',
            templateUrl: 'window/work/work.html',
            controller: 'workCtrl'
        })
});

app.controller('workCtrl', function ($scope, $rootScope, branchFactory){
	
	$scope.branches = branchFactory.getAllBranches().then(function(data){
		console.log(data);
		$scope.branchList = data;
		return data;
	});
	
	$scope.currentBranch = branchFactory.currentBranch;

})




























app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('push', {
            url: '/push',
            templateUrl: 'window/push/push.html',
            controller: 'PushCtrl'
        })
});
app.controller('PushCtrl', function ($scope, $rootScope, branchFactory) {

    $scope.push = function () {

        $rootScope.repo.remote_push("origin", branchFactory.currentBranch, function(err) {
            if (err) throw err;
            console.log("Branch pushed");
        })
    }
});

app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/common/navbar/navbar.html'
    };

});






