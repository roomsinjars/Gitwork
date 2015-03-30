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
		findConflicts: function () {
			var closure = {}
			fsFactory.findFilesInDir($rootScope.repo.path +'/test', ['.git'])
				.then(function (files) {
					self.getConflicts()
					closure.files = files
					console.log('these are the files', closure.files)
					return fsFactory.arrayMap(files, fsFactory.readFile);
				})
				.then(function (arrayOfContents) {
					closure.contents = arrayOfContents
					return fsFactory.arrayMap(arrayOfContents, fsFactory.findInFile)
				})
				.then(function (arrayOfBooleans) {
					closure.booleans = arrayOfBooleans
					closure.conflictFiles = []
					var booleanIndex = 0;
					console.log('this is the array of Booleans', closure.booleans)
					for (var i = 0, len = arrayOfBooleans.length; i < len; i++) {
						if (arrayOfBooleans[i]) {
							closure.conflictFiles.push(closure.contents[i])
						}
					}
					console.log(closure.conflictFiles)
				})
		},
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