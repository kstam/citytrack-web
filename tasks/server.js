var gulp = require('gulp');
var livereload = require('gulp-livereload');
var app = require('../app');

var serverStarted = false;
var server;

function startServer() {
    app.set('port', process.env.PORT || 3000);

    if (serverStarted) {
        console.log('restarting server');
        server.close();
        serverStarted = false;
    }
    server = app.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + server.address().port + ' in ' + app.get('env') + ' mode.');
        serverStarted = true;
    });
}

gulp.task('server:dev', ['build'], function () {
    // Start the server at the beginning of the task
    livereload.listen();
    startServer();

    // watch the less files
    gulp.watch(['src/less/*.less', 'src/less/**/*.less'], ['less']);

    // watch javascript and server templates
    gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['browserify:app']);
    gulp.watch(['views/**/*.hbs'], ['browserify:app']);

    // watch angular templates
    gulp.watch('src/templates/**/*.html', ['angular-templates']);
    gulp.watch('build/templates.js', ['browserify:app']);

    // watch vendor files
    gulp.watch(['node_modules', 'bower_components'], ['browserify:vendor', 'bower:move']);

    // when compiled version changes notify the server
    gulp.watch('public/**/*').on('change', livereload.changed);

    gulp.watch('app.js').on('change', startServer);

});
