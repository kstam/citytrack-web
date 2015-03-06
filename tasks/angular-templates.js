var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');

gulp.task('angular-templates', function () {
    gulp.src('src/**/*.html')
        .pipe(templateCache('templates.js', {standalone: true}))
        .pipe(gulp.dest('build/'));
});
