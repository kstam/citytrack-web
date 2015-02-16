var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

// load tasks
requireDir('./tasks');

gulp.task('build', function(done) {
    return runSequence(
        ['bower', 'jshint'/*, 'test:client'*/],
        ['browserify', 'less'],
        done);
});

// define default task
gulp.task('default', ['build']);
