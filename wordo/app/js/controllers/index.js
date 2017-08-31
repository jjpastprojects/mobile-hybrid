'use strict';

import angular from 'angular';
const bulk = require('bulk-require');

const controllersModule = angular.module('Wordo.controllers', []);
const controllers = bulk(__dirname, ['./**/!(*index|*.spec).js']);

Object.keys(controllers).forEach((key) => {
  let item = controllers[key];
  controllersModule.controller(item.name, item.fn);
});

module.exports = controllersModule;
