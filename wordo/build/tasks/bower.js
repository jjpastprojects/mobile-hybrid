'use strict';

import config from '../config';
import changed from 'gulp-changed';
import gulp from 'gulp';
import browserSync from 'browser-sync';
var bower = require('gulp-bower');

gulp.task('bower', function() {
  return bower()
    .pipe(changed(config.bower.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.bower.dest))
    .pipe(browserSync.stream());
});
