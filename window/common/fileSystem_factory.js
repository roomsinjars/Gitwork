app.factory('fileSystemFactory', function ($rootScope){
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
		}
	}
});