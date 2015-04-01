app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('commit_final', {
            url: '/commit_final',
            templateUrl: 'window/commit_final/commit_final.html',
            controller: 'CommitFinalCtrl',
            resolve: {
				mergeError: function(mergeFactory){
						console.log(mergeFactory.mergeMsg)
						if (mergeFactory.mergeMsg.length>0) {
							console.log(mergeFactory.mergeMsg)
							return mergeFactory.mergeMsg
						} else {
							return false
						}
					}
				}
            })
});