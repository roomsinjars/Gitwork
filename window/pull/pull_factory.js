app.factory('pullFactory', function ($rootScope, $state, commitFactory){

    return {
        pullRepo: function(){
        	commitFactory.unstaged().then(function(data){
        		console.log('pull', data);
	        	if (data.length < 1){
		          $rootScope.repo.remote_fetch("", function(err){
		              if (err) throw err;
		              console.log("fetched repo")
		          })
	        	} else {
	        		$state.go('commit');
	        	}
        		
        	})
        }
    }
});
