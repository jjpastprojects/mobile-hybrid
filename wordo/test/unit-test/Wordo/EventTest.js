require('babel-core/register');

'use strict'

var Config = require('../Config');
var expect = require('expect.js');

var Event = require(Config.BasePath + 'Wordo').Event;

describe("Wordo Event Test", function() {

  it("#createEventMsg test", function() {
    var eventMsg = Event.createEventMsg(Event.EVENT_TYPE.loginSuccess, {
      sourceMsg: 'sourceMsg'
    });
    console.log(JSON.stringify(eventMsg));
  });



});
