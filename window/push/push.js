app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('push', {
            url: '/push',
            templateUrl: 'window/push/push.html',
            controller: 'PushCtrl'
        })
});