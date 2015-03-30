app.config(function ($urlRouterProvider, $locationProvider) {
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

app.run(function ($state, $rootScope) {

    setTimeout(function(){
        //where we can also call foo
        fs.readdir(__dirname, function (err,data){
            if (err) throw err;
            for (var i=0; i<data.length; i++){
                if (data[i]===".git") {
                    $rootScope.repo = git(process.env.PWD);
                    console.log($rootScope.repo);
                    $rootScope.repo.config(function (err, config) {
                        console.log(config.items)
                        $rootScope.username = config.items['user.name'];
                        $rootScope.useremail = config.items['user.email'];
                        console.log($rootScope)
                        return $state.go('branch')
                    })
                }
            }
            return $state.go('noRepo')
        })
    },5000);

	if (install.value==="false") {
	    //npm link on the current directory
	    var exec = require('child_process').exec;
	    exec('npm link', function(error,stdout){
	        console.log('installed', stdout);
	        fs.writeFile('install.json', '{"value": "true"}', function(err){
	            if (err) throw err;
	            console.log('done');
	        })
	    })
	}

})
