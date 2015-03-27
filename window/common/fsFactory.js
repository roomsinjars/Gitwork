app.factory('fsFactory', function ($rootScope, $q){
	return {
		makeDir: function (name, cb) {
			var filePath = __dirname + '/' + name;
			mkdirp(filePath, function (err) {
				console.log('into the makeDir function')
			    if (err) throw err;
			})
		},
		makeDotGitDir: function (name) {
			var filePath = __dirname + '/' + name + '/.git';
			mkdirp(filePath, function (err) {
				console.log('into the makeDotGitDir function')
			    if (err) throw err;
			})
		},
		makeFile: function (dirName, fileName, fileType) {
			var filePath = __dirname + '/' + dirName + '/' + fileName;
			fs.writeFile(filePath, fileName, function(err) {
			    console.log('into write file function')
			    if(err) throw err
			})
		},
		findFilesInDir: function (path, arrToIgnore) {
			return $q(function (resolve, reject) {
				if (!arrToIgnore) {
					recursive(path, function (err, files) {
						if (err) return reject(err)
						resolve(files)
				});
				} else {
					recursive(path, arrToIgnore, function (err, files) {
						if (err) return reject(err)
						resolve(files)
					})
				}	
			})	
		},
		readFile: function (file) {
			return $q(function (resolve, reject) {
				fs.readFile(file, 'utf-8', function (err, contents) {
					if (err) return reject(err);
					resolve(contents)			    		 
				});
			})
		},
		findInFile: function(str) {
			var conflict;
			return $q(function (resolve, reject) {
				if (str.indexOf('<<<<<<< HEAD') != -1) {
		        conflict = true;
			    } else { conflict = false; }
			    resolve(conflict)
			})
			
		},
		arrayMap: function (array, func) {
			var promises = array.map(func);
			return $q.all(promises);
		}
	}
});