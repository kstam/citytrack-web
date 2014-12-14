var gulp = require('gulp');
var browserify = require('browserify');
var browserifyHandlebars = require('browserify-handlebars');
var debowerify = require('debowerify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify({
        entries: ['./src/js/client/main.js'],
        transform: [browserifyHandlebars, debowerify],
        paths: ['./node_modules', './src/js', './views']
    }).bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./public/js'));
});
