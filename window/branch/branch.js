app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('branch', {
            url: '/branch',
            templateUrl: 'window/branch/branch.html',
            controller: 'BranchCtrl',
            resolve: {
					branches: function(branchFactory){
						return $q(function (resolve,reject) {
							branchFactory.switchBranch('master').then(function (data) {
							  return pullFactory.pullRepo()
							}).then(function (data) {
								return branchFactory.getAllBranches()
							}).then(function (data) {
								resolve(data)
							}).catch(function (err){
								reject(err)
							})
						})
					}
            }
        })
});