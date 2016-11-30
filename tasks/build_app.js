'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');
var fileinclude = require('gulp-file-include');
var sass = require('gulp-ruby-sass');
var replace = require('gulp-replace');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');
var buildDir = jetpack.cwd('./build/script')

gulp.task('fileinclude', function() {
  gulp.src([srcDir.path('app.html')])
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./app'))
});

gulp.task('bundle', function () {
    return Promise.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
    ]);
});

gulp.task('sass', () =>
    sass('src/stylesheets/*.scss')
        .on('error', sass.logError)
        .pipe(plumber())
        .pipe(gulp.dest(destDir.path('stylesheets')))
);

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('strings', function() {
  var stringFile = 'config/strings.json';
  projectDir.copy(stringFile, destDir.path('strings.json'), { overwrite: true });
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

    watch('src/**/*.html', batch(function(events, done) {
        gulp.start('fileinclude', beepOnError(done));
    }));
    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.scss', batch(function (events, done) {
        gulp.start('scss', beepOnError(done));
    }));
});

gulp.task('build', ['fileinclude', 'bundle', 'sass', 'environment', 'strings']);
