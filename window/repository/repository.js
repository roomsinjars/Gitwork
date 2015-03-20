app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('noRepo', {
            url: '',
            templateUrl: 'repository.html',
            controller: 'RepoCtrl'
        })
});
