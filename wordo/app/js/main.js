'use strict';

import angular from 'angular';

// angular modules
import 'angular-ui-router';
import 'angular-resource';

import 'ng-facebook';
import 'angularfire';
import 'angular-local-storage';
import 'angular-modal-service';
import 'angular-sanitize';

import './templates';
import './controllers';
import './services';
import './factories';
import './filters';
import './directives';



// create and bootstrap application
const requires = [
  'ui.router',
  'ngResource',
  'templates',
  'ngFacebook',
  'firebase',
  'Wordo.controllers',
  'Wordo.services',
  'Wordo.factories',
  'Wordo.filters',
  'Wordo.directives',
  'LocalStorageModule',
  'angularModalService',
  'ngSanitize'
];
window.Wordo = angular.module('Wordo', requires);

window.Wordo.constant('AppSettings', require('./constants'));

window.Wordo.config(require('./on_config'));

window.Wordo.run(require('./on_run'));
