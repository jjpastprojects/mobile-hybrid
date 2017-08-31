'use strict';

require('babel-core/register');

var gulpConfig = require('../build/config');

exports.config = {

  allScriptsTimeout: 11000,

  //baseUrl: 'http://localhost:' + gulpConfig.browserPort + '/',

  baseUrl: 'http://localhost:3000/',
  directConnect: true,

  capabilities: {
    browserName: 'chrome',
    version: '',
    platform: 'ANY'
  },

  framework: 'jasmine2',

  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: 'all'
    }));
  },

  jasmineNodeOpts: {
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },

  specs: [
    'e2e/**/*.js'
  ]

};
