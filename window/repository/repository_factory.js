app.factory('repoFactory', function ($rootScope){

    return {

        cloneRepo: function(url){
            var cloneURL = url;
            var repoName = url.split('/').pop()
            var localPath = require("path").join(__dirname, repoName);
            
            mkdirp(__dirname + '/' + repoName, function (err) {
                git.clone(cloneURL, localPath, function (err, _repo) {
                    if (err) throw err;
                    var giftRepo = _repo
                    console.log(giftRepo)
                    $rootScope.repo = giftRepo
                    console.log('this is the rootScope.repo', $rootScope.repo)
                })
            })                  
        },
        createRepo: function (name) {
            mkdirp(__dirname + '/' + name, function (err) {
                if (err) throw err;
                mkdirp(__dirname + '/' + name + '/'+'.git', function (err) {
                  if (err) throw err;
                  git.init(__dirname+'/'+name, function (err, _repo) {
                      var giftRepo = _repo
                      console.log(giftRepo)
                      $rootScope.repo = giftRepo
                      fs.writeFile(__dirname+'/'+name + '/README.md', "README", function(err) {
                          if(err) throw err
                          $rootScope.repo.add('README.md', function (err) {
                             if (err) throw err;
                             var author = "blakeprobinson <bprobinson@zoho.com>";
                             $rootScope.repo.identify(author, function (err) {
                                console.log('entered identify function')
                                console.log('post-identify repo', $rootScope.repo.identity)
                                var options = {
                                all: true,
                                amend: false,
                                author: "blakeprobinson <bprobinson@zoho.com>"
                                }
                                 $rootScope.repo.commit("Initial Commit", options, function (err) {
                                    if (err) throw err;
                                })
                             })                             
                          })
                      });   
                  })

                })
            })
        },

        createBranch: function(branchName) {
            $rootScope.repo.create_branch(branchName, function (err) {
                if (err) throw err;
                $rootScope.repo.checkout(branchName, function (err) {
                    if (err) throw err
                })  

            })
        },
        commit: function (repository, commitMsg) {
            var options = {
            all: true,
            amend: false,
            author: "blakeprobinson <bprobinson@zoho.com>"
            }
            repository.commit(commitMsg, options, function (err) {
                if (err) throw err;
            })
        },
        mergeConflictError: function (errMsg) {
            return errMsg
        },
        statusObject: function (statusObject) {
            return statusObject
        },

        status: function (repo, cb) {
            console.log('this is the repo object', repo)
            repo.status(function (err, status) {
                console.log(status.files)
                cb(status.files)
            })
        }, 
        merge: function () {
            var ourSignature = NodeGit.Signature.now("blakeprobinson",
              "bprobinson@zoho.com");
            NodeGit.Repository.open('/Users/blakerobinson/documents/fullstack/Gitwork/test')
                .then(function(repository) {
                    console.log('this is the repo object', repository)
                    return repository.getBranchCommit('test')
                .then(function (commitBranch) {
                    console.log('commitBranch', commitBranch);
                    return repository.getBranchCommit('master')
                .then(function (commitMaster) {
                        console.log('commitMaster', commitMaster);
                    return NodeGit.Merge.commits(repository, commitBranch, commitMaster)
                .then(function (index) {
                    if (!index.hasConflicts()) {
                        index.write();
                        console.log('this is the index', index)
                        return index.writeTreeTo(repository);
                    } else {
                        //on branch...findInFiles('<<<<<<<<master')
                        //$Q is the promise library for angular
                        throw new Error('This merge has conflicts')
                        //get user to fix merge conflicts before writing
                        //to tree...
                    }   
                    })
                .then(function (oid) {
                    console.log('this is the oid', oid)
                    return repository.createCommit('HEAD', ourSignature,
                        ourSignature, "we merged their commit", oid, [commitBranch, commitMaster]);
                })
                .catch(function(error) {
                    $rootScope.mergeConflictError = error;
                    console.log($rootScope.mergeConflictError)
                    this.mergeConflictError(error)
                })
                .done(function (commitId) {
                    if (commitId) {
                        console.log("New Commit: ", commitId);
                    }
                    
                })
                    })
                })
            });
        }
    }

})
