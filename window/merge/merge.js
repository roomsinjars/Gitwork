app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('merge', {
            url: '/merge',
            templateUrl: 'window/merge/merge.html',
            controller: 'MergeCtrl'
        })
});
