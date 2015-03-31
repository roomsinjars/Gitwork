app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('commit_final', {
            url: '/commit_final',
            templateUrl: 'window/commit_final/commit_final.html',
            controller: 'CommitFinalCtrl'
        })
});