var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

gulp.task('browserify', function() {
    var production = gutil.env.type === 'production';

    return gulp.src(['./public/js/main.js'], {read: false})

        .pipe(browserify({
            debug: !production
        }))

        .on('prebundle', function(bundler) {
            // placeholder
        })

        // Rename the destination file
        .pipe(rename('main.js'))

        // Output to the build directory
        .pipe(gulp.dest('./public/js/build/'));
});