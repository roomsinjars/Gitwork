app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'window/home/home.html',
            controller: 'HomeController'
        })
});
