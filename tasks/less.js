var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
    gulp.src('./src/client/less/main.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});