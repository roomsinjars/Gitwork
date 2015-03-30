app.factory('addFactory', function($rootScope, $q){
	return {

		addFiles: function(file) {
			return $q(function (resolve, reject){
				$rootScope.repo.add(file, function (err, data){
					if (err) return reject(err);
					return resolve(data)
				})
			})
		},

		removeFiles: function(file) {
			return $q(function(resolve, reject){
				$rootScope.repo.reset(file, function (err, data){
					if (err) console.log(reject(err));
					console.log('resolve remove', data)
					return resolve(data)
				})
			})
		}

	}
})