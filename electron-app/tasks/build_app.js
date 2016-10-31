'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');
var fileinclude = require('gulp-file-include');
var scss = require('gulp-scss');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');

gulp.task('fileinclude', function() {
  gulp.src(['app/app.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('bundle', ['fileinclude'], function () {
    return Promise.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
    ]);
});

// gulp.task('less', function () {
//     return gulp.src(srcDir.path('stylesheets/main.less'))
//         .pipe(plumber())
//         .pipe(less())
//         .pipe(gulp.dest(destDir.path('stylesheets')));
// });

gulp.task("scss", function () {
  gulp.src(srcDir.path('stylesheets/*.scss'))
        .pipe(scss({"bundleExec": true}))
        .pipe(gulp.dest(destDir.path('stylesheets')));
});

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
    var beepOnError = function (done) {
        return function (err) {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.scss', batch(function (events, done) {
        gulp.start('scss', beepOnError(done));
    }));
});

gulp.task('build', ['bundle', 'scss', 'environment']);
