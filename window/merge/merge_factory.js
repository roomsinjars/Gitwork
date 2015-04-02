app.factory('mergeFactory', function (
	$rootScope, $q, branchFactory, fsFactory, repoFactory) {
	var self = this;
	return {

		mergeExec: function () {
			return $q(function (resolve, reject) {
				var options = {
					cwd: $rootScope.repo.path
				}; 
				exec('git merge master -m "merged master into branch"', options
					//'git merge master -m "merged branch into master"'
					, function (error, stdout, stderr) {
					if (error) {
						var errArr = []
						errArr = error.message.split("\n").slice(0, errArr.length-1)
						self.mergeMsg = errArr
						console.log('this is self.mergeMsg', self.mergeMsg)
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
		}, 

		mergeMsg: [],

	}
});