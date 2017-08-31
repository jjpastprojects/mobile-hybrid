'use strict';

import angular from 'angular';
const bulk = require('bulk-require');

const servicesModule = angular.module('Wordo.services', []);
const services = bulk(__dirname, ['./**/!(*index|*.spec).js']);

Object.keys(services).forEach((key) => {
  let item = services[key];
  servicesModule.service(item.name, item.fn);
});

module.export = servicesModule;
