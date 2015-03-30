app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('add', {
          url: '/add',
          templateUrl: 'window/add/add.html',
          controller: 'addCtrl'
      })
});