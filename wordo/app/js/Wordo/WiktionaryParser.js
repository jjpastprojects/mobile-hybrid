'use strict';

/**
 * 
 * @param  {[type]}
 * @return {[type]}
 */
function wordoReplaceLinks(wordDescription) {
  //remove the {{}} stuff
  var _data = wordDescription.replace(/\{\{.*?\}\}/g, '');
  _data = _data.replace(/\[\[.*?([A-z ]+?)\]\]/g, "<a href='/" + "$1" + "'>$1</a>");
  return _data;
}

/*
  @return string

  return the content of * param of jsonMessage which contains the information needed by us
*/
function getWiktionaryStarString(jsonMsg) {
  let first;
  let parsedData = jsonMsg['query']['pages'];
  for (first in parsedData)
    break;
  parsedData = parsedData[first]['revisions'];
  for (first in parsedData)
    break;
  if (parsedData !== undefined) {
    parsedData = parsedData[first]['*'];
    return parsedData
  } else {
    return null;
  }
}

/*
@return string

capture English string from message:-
**************************************************************
==English==

===Adjective===
{{head|en|adjective}}

# {{context|informal|lang=en}} {{alternative case form of|OK|lang=en}}

===Anagrams===
* [[ko#English|ko]] , [[KO#English|KO]]

[[Category:200 English basic words]]

----
**************************************************************

*/
function getEnglishString(starString) {
  let parsedData = starString.match(/==English==[\s\S]*?----/g);
  if (parsedData == null) {
    parsedData = starString.match(/==English==[\s\S]*/g);
  }
  if (parsedData) {
    return parsedData[0];
  }
  return null;

}

/*
  @return object

  return word details in object format
*/
function getWordDetails(englishString) {
  var wordDetail = {
    Adjective: '',
    Noun: '',
    Verb: '',
    Adverb: '',
    Pronoun: '',
    Article: '',
    Determiner: '',
    Preposition: ''
  };
  for (var _key in wordDetail) {
    var re = new RegExp("={3,4}" + _key + "={3,4}", "g");
    var myIndex = englishString.search(re);
    if (myIndex >= 0) {
      var x101 = englishString;
      x101 = x101.substr(myIndex);
      //go to the first #
      x101 = x101.substr(x101.indexOf('#') + 1);
      //get the first definition
      x101 = x101.substr(0, x101.indexOf('\n'));
      x101 = x101.trim().split('\n');
      var linkFormattedWord = [];
      let cntr = 0;
      for (var i = 0; i < x101.length; i++) {
        let _linkDecorated = wordoReplaceLinks(x101[i]);
        if (_linkDecorated) {
          linkFormattedWord[cntr] = _linkDecorated;
          cntr++;
        }
      };
      wordDetail[_key] = linkFormattedWord;
    }
  }
  return wordDetail;
}


function parseWiktionaryMsg(jsonMsg) {
  console.log("parseWiktionaryMsg>> called");
  let wiktionaryStarString = getWiktionaryStarString(jsonMsg);
  let englishString = getEnglishString(wiktionaryStarString);
  let wordDetails = getWordDetails(englishString);
  return wordDetails;
}

module.exports = {
  'name': "WiktionaryParser",
  'public': [parseWiktionaryMsg],
  'private': [getWiktionaryStarString, getEnglishString, getWordDetails]
};
