var jshint = require('gulp-jshint');
var gulp = require('gulp');
var stylish = require('jshint-stylish');

gulp.task('jshint', function() {
    return gulp.src([
        './src/js/**/*.js',
        './routes/*.js',
        'app.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});
