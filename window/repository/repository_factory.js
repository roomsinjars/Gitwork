app.factory('repoFactory', function ($rootScope, $q, branchFactory){

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
        statusObject: function (statusObject) {
            return statusObject
        },

        status: function (repo, cb) {
            console.log('this is the repo object', repo)
            repo.status(function (err, status) {
                console.log(status.files)
                cb(status.files)
            })
        }
    }

})
