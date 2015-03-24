app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('noRepo', {
            url: '/noRepo',
            templateUrl: 'window/repository/repository.html',
            controller: 'RepoCtrl'
        })
});
