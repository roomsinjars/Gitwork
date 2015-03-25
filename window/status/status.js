app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('status', {
            url: '/status',
            templateUrl: 'window/status/status.html',
            controller: 'StatusCtrl'
        })
});