require('babel-core/register');

'use strict'

var Config = require('./Config');
var expect = require('expect.js');

var AppSettings = require(Config.BasePath + 'constants');
var AppConfig = require(Config.BasePath + 'Config');

console.log(Config.BasePath);

describe("Constant file needed to start the application", function() {

  describe("AppSettings constant required", function() {
    it("should contains WIKTIONARY_URL", function() {
      expect(AppSettings.WIKTIONARY_URL).to.be.a('string')
    });
  });

  describe("AppConfig constant required", function() {
    it("should contains appName", function() {
      expect(AppConfig.appName).to.be.a('string')
    });
  });

});
