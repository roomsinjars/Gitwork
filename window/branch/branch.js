app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('branch', {
            url: '/branch',
            templateUrl: 'window/branch/branch.html',
            controller: 'BranchCtrl',
            resolve: {
            	branches: function() {
            		fs.readdir(__dirname + '/.git/refs/heads', function(err,data){
    							if (err) throw err;
    							return data;
    						})
            	}
            }
        })
});