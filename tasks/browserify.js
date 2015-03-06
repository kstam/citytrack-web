'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var bowerResolve = require('bower-resolve');
var nodeResolve = require('resolve');
var browserResolve = require('browser-resolve');
var mdeps = require('module-deps');
var uglify = require('gulp-uglify');

gulp.task('browserify', ['browserify:vendor', 'browserify:app']);

var moduleDependencies = {};
gulp.task('browserify:deps', function() {
    var dependencies = {};

    getBowerPackageIds().forEach(function(id) {
        var resolved = true;
        try {
            resolved = bowerResolve.fastReadSync(id);
        } catch(e) {}
        dependencies[id] = resolved;
    });

    getNPMPackageIds().forEach(function(id) {
        dependencies[id] = nodeResolve.sync(id);
    });

    var md = mdeps({
        ignoreMissing: true,
        paths: ['./node_modules', './src/js', './views'],
        transform: [],
        resolve: function(id, parent, cb) {
            if (dependencies[id]) {
                moduleDependencies[id] = dependencies[id];
            }
            browserResolve(id, parent, cb);
        }
    });
    md.end({file: './src/js/client/main.js'});

    return md;
});

// this task will go through ./bower.json and
// uses bower-resolve to resolve its full path.
// the full path will then be added to the bundle using require()
gulp.task('browserify:vendor', ['browserify:deps'], function() {
    var b = browserify({
        transform: ['debowerify'],
        debug: gutil.env.type !== 'production'
    });

    _.keys(moduleDependencies).forEach(function(id) {
        console.log("[browserify:vendor] bundling: " + id);
        b.require(moduleDependencies[id], {
            expose: id
        });
    });

    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('browserify:app', ['browserify:deps'], function() {

    var b = browserify('./src/js/client/main.js', {
        debug: gutil.env.type !== 'production',
        paths: ['./node_modules', './src/js', './views']
    });

    _.keys(moduleDependencies).forEach(function(moduleDep) {
        console.log('[browserify:app] ignoring ' + moduleDep + '. It is already bundled');
        b.external(moduleDep);
    });

    // store all dependencies for efficient vendors creation
    return b.bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(gulp.dest('./public/js'));
});

/**
 * Helper function(s)
 */

function getBowerPackageIds() {
    // read bower.json and get dependencies' package ids
    var bowerManifest = {};
    try {
        bowerManifest = require('../bower.json');
    } catch (e) {
        // does not have a bower.json manifest
    }
    return _.keys(bowerManifest.dependencies) || [];

}


function getNPMPackageIds() {
    // read package.json and get dependencies' package ids
    var packageManifest = {};
    try {
        packageManifest = require('../package.json');
    } catch (e) {
        // does not have a package.json manifest
    }
    return _.keys(packageManifest.dependencies) || [];

}