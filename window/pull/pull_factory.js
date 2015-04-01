app.factory('pullFactory', function ($rootScope, $state, commitFactory, $q){

    return {
        pullRepo: function(){

            return $q(function(resolve, reject){
                commitFactory.unstaged().then(function(data){
                    console.log('pull', data);
                    if (data.length < 1){
                        $rootScope.repo.sync('origin', 'master', function(err){
                            if (err) throw err;
                            resolve(err);
                            console.log("fetched repo");
                        })
                    } else {
                        $state.go('commit');
                    }
                })
            })
        }
    }
});
