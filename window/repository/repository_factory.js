app.factory('repoFactory', function(){

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
        commit: function (repository) {
            var repo = repository;

            //var oid = Commit.create(repo, update_ref, author, committer, message_encoding, message, tree, parent_count, parents);

            var path = require("path");
            var promisify = require("promisify-node");
            var fse = promisify(require("fs-extra"));
            var fileName = "newfile.txt";
            var fileContent = "hello world";
            var directoryName = "./";
            var __dirname = path.resolve(path.dirname());
            // ensureDir is an alias to mkdirp, which has the callback with a weird name
            // and in the 3rd position of 4 (the 4th being used for recursion). We have to
            // force promisify it, because promisify-node won't detect it on its
            // own and assumes sync
            fse.ensureDir = promisify(fse.ensureDir);

            /**
             * This example creates a certain file `newfile.txt`, adds it to the git
             * index and commits it to head. Similar to a `git add newfile.txt`
             * followed by a `git commit`
             **/

            var repo;
            var index;
            var oid;

            NodeGit.Repository.open(path.resolve(__dirname, "./repos/test/.git"))
                .then(function(repoResult) {
                    repo = repoResult;
                    console.log('opened repo', repo);
                    return fse.ensureDir(path.join(repo.workdir(), directoryName));
                }).then(function(){
                    return fse.writeFile(path.join(repo.workdir(), fileName), fileContent);
                })
                .then(function() {
                    return fse.writeFile(
                        path.join(repo.workdir(), directoryName, fileName),
                        fileContent
                    );
                })
                .then(function() {
                    return repo.openIndex();
                })
                .then(function(indexResult) {
                    index = indexResult;
                    return index.read(1);
                })
                .then(function() {
                    // this file is in the root of the directory and doesn't need a full path
                    return index.addByPath(fileName);
                })
                .then(function() {
                    // this file is in a subdirectory and can use a relative path
                    return index.addByPath(path.join(directoryName, fileName));
                })
                .then(function() {
                    // this will write both files to the index
                    return index.write();
                })
                .then(function() {
                    return index.writeTree();
                })
                .then(function(oidResult) {
                    oid = oidResult;
                    return NodeGit.Reference.nameToId(repo, "HEAD");
                })
                .then(function(head) {
                    return repo.getCommit(head);
                })
                .then(function(parent) {
                    var author = NodeGit.Signature.create("Blake Robinson",
                        "bprobinson@zoho.com", 123456789, 60);
                    var committer = NodeGit.Signature.create("Blake Robinson",
                        "bprobinson@zoho.com", 987654321, 90);

                    return repo.createCommit("HEAD", author, committer, "message", oid, [parent]);
                })
                .done(function(commitId) {
                    console.log("New Commit: ", commitId);
                });
        }

    }

});
