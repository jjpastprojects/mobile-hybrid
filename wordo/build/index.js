'use strict';

import fs from 'fs';
import onlyScripts from './util/scriptFilter';
var gutil = require('gulp-util');


const tasks = fs.readdirSync('./build/tasks/').filter(onlyScripts);
var option = process.argv[3];

tasks.forEach((task) => {
  require('./tasks/' + task);
});
