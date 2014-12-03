var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var debug = require('gulp-debug');

gulp.task('npm:css', function() {
    return gulp.src([
        './node_modules/leaflet/dist/*.css',
        './node_modules/*/*.css'
    ])
        .pipe(concat('thirdparty.css'))
        .pipe(minify())
        .pipe(gulp.dest("./public/styles/vendor/"));
});

gulp.task('npm:img', function() {
    var paths = getImagePathsForModules([
        'leaflet'
    ]);

    return gulp.src(paths, {base: './node_modules'})
        .pipe(gulp.dest("./public/img/vendor/"));
});

function getImagePathsForModules(moduleNames) {
    var paths = [];
    var matcher = (moduleNames.length === 1) ?  moduleNames[0] : "{" + moduleNames.join() + "}";

    paths.push('./node_modules/' + matcher + '/**/*.gif');
    paths.push('./node_modules/' + matcher + '/**/*.jpg');
    paths.push('./node_modules/' + matcher + '/**/*.jpeg');
    paths.push('./node_modules/' + matcher + '/**/*.png');
    return paths;
}

gulp.task('css', ['npm:css']);
gulp.task('img', ['npm:img']);
gulp.task('vendor', ['img', 'css']);
