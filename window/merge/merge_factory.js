app.factory('mergeFactory', function ($rootScope, $q, branchFactory) {

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
			
		// mergeConflictError: function (errMsg) {
		//     return errMsg
		// }
		}
	}
});