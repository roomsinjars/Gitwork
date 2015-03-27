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