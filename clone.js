var NodeGit = require("nodegit");

var __dirname = "repos"
var cloneURL = "https://github.com/nodegit/test";
var localPath = require("path").join(__dirname, "tmp");
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


var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
  return commit.message();
};

NodeGit.Repository.open("node_modules/nodegit")
  .then(getMostRecentCommit)
  .then(getCommitMessage)
  .then(function(message) {
    console.log(message);
  });