var jshint = require('gulp-jshint');
var gulp = require('gulp');
var stylish = require('jshint-stylish');
var checkstyleFileReporter = require('jshint-checkstyle-file-reporter');

process.env.JSHINT_CHECKSTYLE_FILE = 'build/jshint.xml';

gulp.task('jshint:dev', function() {
    return gulp.src([
        './src/js/**/*.js',
        './routes/*.js',
        'app.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('jshint:jenkins', function() {
    return gulp.src([
        './src/js/**/*.js',
        './routes/*.js',
        'app.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter(checkstyleFileReporter));
});

gulp.task('jshint', ['jshint:jenkins', 'jshint:dev']);
