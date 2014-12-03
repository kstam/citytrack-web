var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run({
        file: './bin/www'
    });

    // Restart the server when file changes
//    gulp.watch(['views/*.hbs', 'views/**/*.hbs'], [server.run]);
//    gulp.watch(['public/styles/*.less', 'public/styles/**/*.less'], ['styles:less']);
//    gulp.watch(['public/styles/*.css', 'public/styles/**/*.css'], ['styles:css', server.notify]);
    gulp.watch(['public/js/**/*.js', "!public/js/build/main.js"], ['browserify']);
    gulp.watch('public/js/build/main.js', server.notify);
//    gulp.watch(['public/img/**/*'], server.notify);
//    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});