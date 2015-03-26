app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('work', {
            url: '/work',
            templateUrl: 'window/work/work.html',
            controller: 'workCtrl'
        })
});

app.controller('workCtrl', function ($scope, $rootScope, branchFactory){
	
	$scope.branches = branchFactory.getAllBranches().then(function(data){
		console.log(data);
		$scope.branchList = data;
		return data;
	});
	
	$scope.currentBranch = branchFactory.currentBranch;

})



























