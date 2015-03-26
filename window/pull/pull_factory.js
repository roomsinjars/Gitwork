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
