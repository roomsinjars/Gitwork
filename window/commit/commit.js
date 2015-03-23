app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('commit', {
            url: '/',
            templateUrl: 'window/commit/commit.html',
            controller: 'CommitCtrl'
        })
});