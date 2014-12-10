var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var minify = require('gulp-minify-css');

gulp.task('less', function() {
    return gulp.src('./src/less/main.less')
        .pipe(less())
        .pipe(minify())
        .pipe(gulp.dest('./public/css'));
});
