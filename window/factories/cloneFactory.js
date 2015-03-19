var NodeGit = require("nodegit");

app.factory('cloneFactory', function(){
	
	return {
		cloneRepo: function(url){
			var __dirname = "repos"
			var cloneURL = url;
			var repoName = function (url){
    				return url.split('/').pop()
				}
			var localPath = require("path").join(__dirname, repoName);
			var cloneOptions = {};

			var errorAndAttemptOpen = function() {
			  return NodeGit.Repository.open(local);
			};

			cloneOptions.remoteCallbacks = {
			  certificateCheck: function() { return 1; }
			};

			var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);

			cloneRepository.catch(errorAndAttemptOpen)
			  .then(function(repository) {
			    // Access any repository methods here.
			    console.log("Is the repository bare? %s", Boolean(repository.isBare()));
			  });


			return $http.post('/api/admin/itemCreate', data)
				.then(function(response){
					return response.data;
			})
		}
	}

})