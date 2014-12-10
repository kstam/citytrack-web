var gulp = require('gulp');
var server = require('gulp-express');
var requireDir = require('require-dir');

// load tasks
requireDir('./tasks');

// define default task
gulp.task('default', ['bower', 'browserify', 'less']);
