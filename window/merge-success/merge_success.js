app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('merge-success', {
            url: '/mergeSuccess',
            templateUrl: 'window/merge-success/merge_success.html',
            controller: 'MergeSucCtrl'
        })
});

app.controller('MergeSucCtrl', function($scope){

})