'use strict';

import path from 'path';
var gutil = require('gulp-util');

// Filters out non .js files. Prevents
// accidental inclusion of possible hidden files
export default function(name) {
  return /(\.(js)$)/i.test(path.extname(name));

};
