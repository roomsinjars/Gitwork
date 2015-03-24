app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('branch', {
            url: '/branch',
            templateUrl: 'window/branch/branch.html',
            controller: 'BranchCtrl'
        })
});