var nw = require('nw.gui');
var win = nw.Window.get();
var NodeGit = require("nodegit");

var cloneURL = "https://github.com/nodegit/test";
var localPath = require("path").join("repos", "tmp");
var cloneOptions = {};

var errorAndAttemptOpen = function() {
  return NodeGit.Repository.open(local);
};


cloneOptions.remoteCallbacks = {
  certificateCheck: function() { return 1; }
};

var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);

// NodeGit.Clone("https://github.com/nodegit/nodegit", 'nodegit', { ignoreCertErrors: 1 })
// 	.then(function(repository) {
// 		assert.ok(repository instanceof Repository);
//   		console.log(repository)
// 	}, function (err) {
// 		console.log(err)
// 	});


var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
  return commit.message();
};

cloneRepository.catch(errorAndAttemptOpen)
  .then(function(repository) {
    // Access any repository methods here.
    console.log("Is the repository bare? %s", Boolean(repository.isBare()));
  });

NodeGit.Repository.open("node_modules/nodegit")
  .then(getMostRecentCommit)
  .then(getCommitMessage)
  .then(function(message) {
    console.log(message);
  });