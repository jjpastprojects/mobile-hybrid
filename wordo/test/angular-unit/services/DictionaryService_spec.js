/*global angular */

'use strict';

import responseMsg from './ok.json'

describe('Unit: DictionaryService', function() {

  var http, service, appSettings;

  beforeEach(function() {
    // instantiate the app module
    angular.mock.module('Wordo');

    // mock the service
    angular.mock.inject(function($resource, $httpBackend, DictionaryService, AppSettings) {
      http = $httpBackend;
      service = DictionaryService;
      appSettings = AppSettings;
    });
  });

  it('should exist', function() {
    expect(service).toBeDefined();
  });

  it('should retrieve data', function(done) {

    console.log(responseMsg);
    
    http.expect('JSONP', appSettings.WIKTIONARY_URL + '&callback=JSON_CALLBACK&titles=ok').respond(200, {
      data: responseMsg
    });

    service.get('ok').then(function(result) {
      console.log(result);
    }, function(error) {
      console.log(error);
    }).then(done);
    http.flush();
  });

});
