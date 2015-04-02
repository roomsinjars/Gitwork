app.factory('pullFactory', function ($rootScope, $state, commitFactory, $q){

    return {
        pullRepo: function(){

            return $q(function (resolve, reject) {
                var options = {
                    cwd: $rootScope.repo.path
                }; 
                exec('git pull', options, function (error, stdout, stderr) {
                    if (error) {
                        var errArr = []
                        errArr = error.message.split("\n").slice(0, errArr.length-1)
                        reject(errArr)
                    } else {
                        console.log('getting here, too')
                        console.log('this is the raw data', stdout)
                        var arrStrData = [];
                        arrStrData = stdout.split("\n").slice(0, arrStrData.length-1)
                        self.mergeMsg = arrStrData
                        resolve(arrStrData)
                    }
                })            
            });
        }
    }
});
