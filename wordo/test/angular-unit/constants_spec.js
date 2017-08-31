/*global angular */

'use strict';

describe('Unit: Constants', function() {

  var constants;

  beforeEach(function() {
    // instantiate the app module
    angular.mock.module('Wordo');

    // mock the directive
    angular.mock.inject(function(AppSettings) {
      constants = AppSettings;
    });
  });

  it('should exist', function() {
    expect(constants).toBeDefined();
  });

  it('should have an application name', function() {
    //expect(constants.appTitle).toEqual('Example Application');
  });

});