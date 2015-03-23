app.factory('repoFactory', function ($rootScope){

    return {

        cloneRepo: function(url){
            var __dirname = "repos";
            var cloneURL = url;
            var repoName = url.split('/').pop();

            console.log(repoName);
            var localPath = require("path").join(__dirname, repoName);
            var cloneOptions = {};

            var errorAndAttemptOpen = function() {
                return NodeGit.Repository.open(local);
            };

            cloneOptions.remoteCallbacks = {
                certificateCheck: function() { return 1; }
            };

            var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);

            return cloneRepository.catch(errorAndAttemptOpen)
                .then(function(repository) {
                    return repository;
                    console.log("Is the repository bare? %s", Boolean(repository.isBare()));
                });
        },
        createRepo: function (name) {
            var pathToRepo = require("path").resolve("./repos/" + name);
            var isBare = 0; // lets create a .git subfolder

            return NodeGit.Repository.init(pathToRepo, isBare).then(function (repo) {
                return repo
            });
        },
        commit: function (repo, message) {
            repo.commit
        }

    }

});
