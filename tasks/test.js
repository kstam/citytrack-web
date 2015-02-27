var gulp = require('gulp');
var karma = require('karma').server;

gulp.task('test:client', function(done) {
    karma.start({
        configFile: __dirname + '/../karma.config.js',
        singleRun: true
    }, done);
});

gulp.task('test:jenkins', function(done) {
   karma.start({
       configFile: __dirname + '/../karma.config.jenkins.js',
       singleRun: true
   }, done);
});
