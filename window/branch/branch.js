app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('branch', {
            url: '/',
            templateUrl: 'window/branch/branch.html',
            controller: 'BranchCtrl'
        })
});