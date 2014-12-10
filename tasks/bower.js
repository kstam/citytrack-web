var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');
var minify = require('gulp-minify-css');
var replace = require('gulp-replace');

gulp.task('bower', function (done) {
    runSequence(
        'bower:install',
        'bower:move',
        done);
});

gulp.task('bower:install', function () {
    return bower()
        .pipe(gulp.dest('./bower_components'));
});

gulp.task('bower:move', ['bower:css', 'bower:img']);

gulp.task('bower:css', function() {
    return gulp.src(bowerCssFiles())
        .pipe(replace(/(url\(['"]*)([^\n]*\/)*([^\/\n]+)(\.(png|gif|jpg|jpeg)['"]*\))/gi, '$1/img/vendor/$3$4'))
        .pipe(concat('thirdparty.css'))
        .pipe(minify())
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('bower:img', function() {
    return gulp.src(bowerImgFiles())
        .pipe(gulp.dest('./public/img/vendor/'));
});

function bowerImgFiles() {
    return mainBowerFiles({
        paths: {
            bowerDirectory: './bower_components',
            bowerrc: './.bowerrc',
            bowerJson: './bower.json'
        },
        filter: /.*\.(gif|png|jpg|gpeg)$/
    });
}

function bowerCssFiles() {
    return mainBowerFiles({
        paths: {
            bowerDirectory: './bower_components',
            bowerrc: './.bowerrc',
            bowerJson: './bower.json'
        },
        filter: /.*\.css$/
    });
}
