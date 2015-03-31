app.factory('commitFactory', function($rootScope, $q, Status){
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
		},

		unstaged: function() {
			return $q(function(resolve, reject){
				Status.get().then(function(data) {
					var arr = [];
					for (var i=0; i< data.length; i++){
						if(data[i].staged == false) arr.push(data[i]);
					}
					return resolve(arr);
				})
				
			})
		},

		staged: function() {
			return $q(function(resolve, reject){
				Status.get().then(function(data) {
					var arr = [];
					for (var i=0; i< data.length; i++){
						if(data[i].staged == true) arr.push(data[i]);
					}
					return resolve(arr);
				})
				
			})
		}	


	}
})
