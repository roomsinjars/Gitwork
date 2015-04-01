app.config(function ($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('merge-failure', {
            url: '/mergeFailure',
            templateUrl: 'window/merge-failure/merge_failure.html',
            controller: 'MergeCtrl'
        })
});
