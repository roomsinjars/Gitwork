app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('commit', {
          url: '/commit',
          templateUrl: 'window/commit/commit.html',
          controller: 'CommitCtrl',
          resolve: {
          	unstaged: function(commitFactory){
          							return commitFactory.unstaged()
          						},

          	staged: function(commitFactory){
          							return commitFactory.staged()
          						}
							
										
          	}
       }) 
});