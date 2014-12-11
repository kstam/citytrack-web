var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

// load tasks
requireDir('./tasks');

// define default task
gulp.task('default', function(done) {
    return runSequence(
        ['bower', 'jshint', 'test:client'],
        ['browserify', 'less'],
        done);
});
