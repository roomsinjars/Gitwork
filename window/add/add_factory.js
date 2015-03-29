app.factory('addFactory', function($rootScope, $q){
	return {
	

		addFiles: function(file) {
			return $q(function (resolve, reject){
				$rootScope.repo.add(file, function (err, data){
					if (err) return reject(err);
					console.log('factory', data);
					resolve(data)
				})
			})
		}
	}
})