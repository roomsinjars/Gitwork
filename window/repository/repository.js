app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('noRepo', {
            url: '',
            templateUrl: 'window/repository/repository.html',
            controller: 'RepoCtrl'
        })
});
