/*global browser */

'use strict';

describe('E2E: Routes', function() {


  beforeEach(function() {
    browser.get('/ok');
    browser.waitForAngular();
  });

  it('should have a working home route', function() {
    browser.get('/ok');
    console.log("++++++++++++++++++++++++++++++++++++++");
    console.log(browser.getLocationAbsUrl());
    console.log("++++++++++++++++++++++++++++++++++++++");
    expect(browser.getLocationAbsUrl()).toMatch('/DEFAULT');
  });

});
