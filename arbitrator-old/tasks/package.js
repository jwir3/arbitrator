"use strict";

var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('package', shell.task([
  'build --x64 --publish never'
]))
