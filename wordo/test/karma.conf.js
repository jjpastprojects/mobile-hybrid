'use strict';

var istanbul = require('browserify-istanbul');
var isparta = require('isparta');

module.exports = function(config) {

  config.set({

    basePath: '../',
    frameworks: ['jasmine', 'browserify'],
    preprocessors: {
      'app/js/**/*.js': ['browserify', 'coverage'],
      'test/angular-unit/**/*.js': ['browserify']
    },
    browsers: ['Chrome'],
    reporters: ['spec', 'coverage'],
    client: {
      captureConsole: true
    },
    autoWatch: true,
    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,
    browserify: {
      debug: true,
      extensions: ['.js'],
      transform: [
        'babelify',
        'browserify-ngannotate',
        'bulkify',
        istanbul({
          instrumenter: isparta,
          ignore: ['**/node_modules/**', '**/test/**']
        })
      ]
    },

    proxies: {
      '/': 'http://localhost:9876/'
    },

    urlRoot: '/__karma__/',

    files: [
      // app-specific code
      'app/js/main.js',

      // 3rd-party resources
      'node_modules/angular-mocks/angular-mocks.js',

      // test files
      'test/angular-unit/**/*.js'
    ]

  });

};
