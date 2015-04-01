app.factory('pullFactory', function ($rootScope, $state, commitFactory, $q){

    return {
        pullRepo: function(){

            return $q(function(resolve, reject){
                commitFactory.unstaged().then(function(data){
                    console.log('pull', data);
                    if (data.length < 1){
                        $rootScope.repo.sync([],function(err){
                            if (err) throw err;
                            console.log("fetched repo");
                            resolve(data)
                        })
                    } else {
                        $state.go('commit');
                    }
                })
            })
        }
    }
});
