'use strict';

import fs from 'fs';
import config from '../config';
import gulp from 'gulp';
var gutil = require('gulp-util');

function isObject(Obj) {
  if (typeof Obj == 'object') return true;
  return false;
}

gulp.task('enviroment', function() {


  var LINEBREAK_1 = '\n';
  var LINEBREAK_2 = '\n\n';
  var LINEBREAK_3 = '\n\n\n';
  var LINEBREAK_4 = '\n\n\n\n';
  var TAB = '\t';
  var FOLDER_PATH = config.enviroment.configFolder;
  var FILE_NAME =   (gutil.env.configFile ? gutil.env.configFile : config.enviroment.defaultConfigFile) + '.json';
  
  var FOLDER_PATH_TO_WRITE = config.enviroment.destFolder;
  var FILE_NAME_TO_WRITE = 'Config.js';
  var configObject = JSON.parse(fs.readFileSync(FOLDER_PATH + '/' + FILE_NAME, 'utf8'));
  gutil.log(JSON.stringify(configObject) + '\n')

  var jsFIleMsg = "";
  jsFIleMsg += "'use strict'";
  jsFIleMsg += LINEBREAK_2
  jsFIleMsg += 'const Config = {';
  jsFIleMsg += LINEBREAK_1
  for (var configItem in configObject) {
    if (isObject(configObject[configItem])) continue;
    jsFIleMsg += TAB;
    jsFIleMsg += configItem;
    jsFIleMsg += "  :  ";
    switch (typeof configObject[configItem]) {
      case 'string':
        jsFIleMsg += ("'" + configObject[configItem] + "'");
        break;
      default:
        jsFIleMsg += jsFIleMsg;
    }
    jsFIleMsg += ",";
    jsFIleMsg += LINEBREAK_1
  }

  //remove last character
  jsFIleMsg = jsFIleMsg.slice(0, -2);
  jsFIleMsg += LINEBREAK_1
  jsFIleMsg += '};';
  jsFIleMsg += LINEBREAK_2
  jsFIleMsg += 'module.exports = Config;';
  console.log(jsFIleMsg);
  fs.writeFile(FOLDER_PATH_TO_WRITE + FILE_NAME_TO_WRITE, jsFIleMsg, function(err) {
    if (err) return console.log(err);
    console.log('Successful!!');
  });
});
