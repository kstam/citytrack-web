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
        console.log('Express server listening on port ' + server.address().port);
        serverStarted = true;
    });
}

gulp.task('server:dev', function () {
    // Start the server at the beginning of the task
    livereload.listen();
    startServer();

    // watch the less files
    gulp.watch(['src/less/*.less', 'src/less/**/*.less'], ['less']);

    // watch javascript and templates
    gulp.watch(['src/js/client/*.js', 'src/js/client/**/*.js'], ['browserify']);
    gulp.watch(['views/**/*.hbs'], ['browserify']);

    // when compiled version changes notify the server
    gulp.watch('public/css/*.css').on('change', livereload.changed);
    gulp.watch('public/js/main.js').on('change', livereload.changed);
    gulp.watch('public/img/**/*').on('change', livereload.changed);

    gulp.watch('app.js').on('change', startServer);

});