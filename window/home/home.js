app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'window/home/home.html',
            controller: 'HomeController'
        })
});
