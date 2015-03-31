app.factory('pullFactory', function ($rootScope, branchFactory){

    return {
        pullRepo: function(){
        	console.log(branchFactory.currentBranch.length);
        	if (branchFactory.currentBranch.length < 1){
	          $rootScope.repo.remote_fetch("", function(err){
	              if (err) throw err;
	              console.log("fetched repo")
	          })
        	} else {
        		$state.go('commit');
        	}
        }
    }
});
