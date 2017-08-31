'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('dev', ['clean'], function(cb) {

  global.isProd = false;

  runSequence('enviroment',['styles', 'images', 'fonts', 'views', 'browserify','bower'], 'watch', cb);

});