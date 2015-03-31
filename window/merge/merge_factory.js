app.factory('mergeFactory', function (
	$rootScope, $q, branchFactory, fsFactory, repoFactory) {
	var self = this;
	return {

		getRepo: function (path) {
			return $q(function (resolve, reject) {
				var repo = {}
				if (!path) {
					var pathError = new Error('repo path is not defined')
					reject(pathError)
				} else {
					NodeGit.Repository.open(path)
				        .then(function(repository) {
				        	repo.repo = repository
				        	var signature = NodeGit.Signature.default(repository)
				        	//signature = signature.toString()
				        	repo.signature = signature
				        	console.log('getRepo repo Object', repo)
							resolve(repo)
					})
				}
			})
		},

		getBranchCommit: function (repo) {
			return $q(function (resolve, reject) {
				repo.currentBranch = branchFactory.currentBranch
				console.log('this is repo.currentBranch', repo.currentBranch)
				if (!repo.currentBranch || !repo) {
					var branchErr = new Error('branch is not defined')
					reject(branchErr)
				} else {
					repo.repo.getBranchCommit(repo.currentBranch)
						.then(function (branchCommit) {
							repo.branchCommit = branchCommit;
							console.log('repo after getbranchCommit', repo)
							resolve(repo)
							
						})
				}
			})
		},

		getMasterCommit: function (repo) {
			return $q(function (resolve, reject) {
				if (!repo) {
					var repoErr = new Error('repo is not defined')
					reject(branchErr)
				} else {
					repo.repo.getBranchCommit('master')
						.then(function (masterCommit) {
							repo.masterCommit = masterCommit;
							console.log('repo after getMasterCommit', repo)
							resolve(repo)
							
						})
				}
			})
		}, 
		
		mergeCommits: function (repo) {
			return $q(function (resolve, reject) {
				var mergeOptions = new NodeGit.MergeOptions()
				mergeOptions.fileFavor = 2
				NodeGit.Merge.commits(repo.repo, repo.branchCommit, repo.masterCommit, null)
					.then(function (index) {
						if (!index.hasConflicts()) {
			                index.write();
			                console.log('this is the index', index)
			                repo.index = index;
			                console.log('repo at mergeCommits', repo)
			                resolve(repo);
			            } else {
			                var conflictErr = new Error('This merge has conflicts')
			                reject(conflictErr)
			            }  
			        })
				})				
		},

		addToIndex: function (repo) {
			return $q(function (resolve, reject) {
				repo.index.writeTreeTo(repo.repo)
					.then(function (oid) {
					    console.log('this is the oid', oid)
					    repo.oid = oid
					    console.log('repo at addToIndex', repo)
					    resolve(repo)	    
				})
			})
		},

		postMergeCommit: function (repo) {
			return new $q(function (resolve, reject) {
				// var commitMsg = 'merged master into ' + repo.currentBranch
				// var options = {
				// 	all: true,
				// 	amend: false,
				// 	author: repo.signature
				// }
				// var commitMsg = 'merged master into ' + repo.currentBranch
				// $rootScope.repo.commit(commitMsg, options, function (err) {
				// 	console.log(err)
				// 	if (err) {
				// 		reject(err)
				// 	} else {
				// 		repo.postMergeCommit = true;
				// 		resolve(repo)
				// 		console.log('postMergeCommit', repo)
				// 	}
				// })


				repo.repo.createCommit('HEAD', 
					repo.signature,
					repo.signature, 
					"merged master into" + repo.currentBranch, 
					repo.oid, 
					[repo.branchCommit, repo.masterCommit])
				.then(function (commitId) {
					repo.postMergeCommitId = commitId
					console.log('repo at postMergeCommit', repo)
					resolve(repo)
				})
				.catch(function (err) {
					console.log('this is the error', err)
				})
			})
		},


		errorHandler: function (reason) {
			return $q(function (resolve, reject) {
				if (reason.message === 'This merge has conflicts') {
        			reject(reason)
        		} else {
        			resolve(reason)
        		}
			})
		},

		mergeSpawn: function () {
			return $q(function (resolve, reject) {
				var git = spawn('git', ['merge', 'master']); 
				git.stdout.on('data', function (data) {
					console.log('this is the raw', data)
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
		},

		getConflicts: function () {

			//this is happening at the wrong working directory
			return $q(function (resolve, reject) {
				var options = {
					cwd: $rootScope.repo.path
				}
				var git = spawn('git', ['diff-files', '--name-only'], options);
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