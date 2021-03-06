var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

//uncomment code before deployment

gulp.task('default', function () {
    gulp.src(['modules.js','window/**/*.js'])
        //.pipe(sourcemaps.init())
        .pipe(concat('public/app.js'))
        //.pipe(ngAnnotate())
        //.pipe(uglify())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('.'))
});

gulp.task('watch',function () {
    gulp.watch('window/**/*.js', ['default'])
});
