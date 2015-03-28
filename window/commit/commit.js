app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('commit', {
          url: '/commit',
          templateUrl: 'window/commit/commit.html',
          controller: 'CommitCtrl'
      })
});