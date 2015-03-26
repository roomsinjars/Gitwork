app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('work', {
            url: '/work',
            templateUrl: 'window/work/work.html',
            controller: 'workCtrl'
        })
});

app.controller('workCtrl', function ($scope, $rootScope, branchFactory){
	console.log('work', branchFactory.currentbranch);
	$scope.branches = branchFactory.branches;
	$scope.currentBranch = branchFactory.currentBranch;

})



























