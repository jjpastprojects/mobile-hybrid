require('babel-core/register');

'use strict'

var request = require('superagent');
var fs = require('fs');

var Config = require('../Config');
var expect = require('expect.js');

var WiktionaryParser = require(Config.BasePath + 'Wordo').WiktionaryParser;


function getWiktionaryRes(searchWord, cb) {
  var url = 'http://en.wiktionary.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&titles=' + searchWord;
  request
    .get(url)
    .end(function(err, res) {
      if (err) {
        cb(err, res);
        return;
      }
      fs.writeFile(__dirname + '/resposne/ok.json', res.text, function(err) {
        if (err) {
          return console.log(err);
        }
      });
      cb(err, JSON.parse(res.text));
    });
}


describe("Wordo WiktionaryParser Test", function() {

  it("#getWiktionaryStarString test", function(done) {
    getWiktionaryRes('dispute', function(err, res) {
      var parseWord = WiktionaryParser._getWiktionaryStarString(res);
      fs.writeFile(__dirname + '/resposne/ok_getWiktionaryStarString.json', parseWord);
      done();
    });
  });

  it("#getEnglishString test", function(done) {
    getWiktionaryRes('dispute', function(err, res) {
      var wiktionaryStarString = WiktionaryParser._getWiktionaryStarString(res);
      var englishString = WiktionaryParser._getEnglishString(wiktionaryStarString);
      fs.writeFile(__dirname + '/resposne/ok_getEnglishString.json', englishString);
      done();
    });
  });


  it("#getWordDetails test", function(done) {
    getWiktionaryRes('dispute', function(err, res) {
      var wiktionaryStarString = WiktionaryParser._getWiktionaryStarString(res);
      var englishString = WiktionaryParser._getEnglishString(wiktionaryStarString);
      var wordDetails = WiktionaryParser._getWordDetails(englishString);
      console.log(JSON.stringify(wordDetails));
      done();
    });
  });

  it("#parseWiktionaryMsg test", function(done) {
    getWiktionaryRes('dispute', function(err, res) {
      var wordDetails = WiktionaryParser.parseWiktionaryMsg(res);
      console.log(JSON.stringify(wordDetails));
      done();
    });
  });

});
