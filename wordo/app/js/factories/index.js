'use strict';

import angular from 'angular';
const bulk = require('bulk-require');

const factoriesModule = angular.module('Wordo.factories', []);
const factories = bulk(__dirname, ['./**/!(*index|*.spec).js']);

Object.keys(factories).forEach((key) => {
  let item = factories[key];
  factoriesModule.factory(item.name, function() {
    return item.fn;
  });
});


module.export = factoriesModule;
