'use strict';

export default {

  browserPort: 3000,
  UIPort: 3001,

  appDir: './',
  sourceDir: './app/',
  buildDir: './dist/',

  styles: {
    src: 'app/styles/**/*.scss',
    dest: 'dist/css',
    prodSourcemap: false,
    sassIncludePaths: []
  },

  scripts: {
    src: 'app/js/**/*.js',
    dest: 'dist/js'
  },

  images: {
    src: 'app/images/**/*',
    dest: 'dist/images'
  },

  bower: {
    src: 'bower_components',
    dest: 'dist/vendor'
  },

  fonts: {
    src: ['app/fonts/**/*'],
    dest: 'dist/fonts'
  },

  vendor: {
    src: ['vendor/**/**/*'],
    dest: 'dist/vendor'
  },

  assetExtensions: [
    'js',
    'css',
    'png',
    'jpe?g',
    'gif',
    'svg',
    'eot',
    'otf',
    'ttc',
    'ttf',
    'woff2?',
    'html'
  ],

  views: {
    index: 'app/pages/*.html',
    src: 'app/views/**/*.html',
    dest: 'app/js'
  },

  gzip: {
    src: 'dist/**/*.{html,xml,json,css,js,js.map,css.map}',
    dest: 'dist/',
    options: {}
  },

  enviroment: {
    configFolder: 'config/',
    defaultConfigFile: 'dev',
    destFolder: 'app/js/'
  },

  browserify: {
    bundleName: 'main.js',
    prodSourcemap: false
  },

  test: {
    karma: 'test/karma.conf.js',
    protractor: 'test/protractor.conf.js'
  },

  init: function() {
    this.views.watch = [
      this.views.index,
      this.views.src
    ];

    return this;
  }

}.init();
