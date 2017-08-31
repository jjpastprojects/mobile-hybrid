'use strict';

function DictionaryService($resource, AppSettings, DataService, App) {
  'ngInject';

  let WiktionaryResource = $resource(AppSettings.WIKTIONARY_URL, {
    callback: "JSON_CALLBACK"
  }, {
    get: {
      method: "JSONP",
      isArray: true
    },
    query: {
      method: "JSONP",
      isArray: false
    }

  });

  const service = {};
  service.get = function(searchParam) {
    return new Promise((resolve, reject) => {
      WiktionaryResource.query({
        // + '|lang=en' searchParam.toUpperCase()
        'titles': searchParam.toLowerCase()
      }, (data) => {
        let wordDetails = App.WiktionaryParser.parseWiktionaryMsg(data);
        resolve(wordDetails);
      }, (err, status) => {
        reject(err, status);
      });
    });
  };
  return service;
}

module.exports = {
  name: 'DictionaryService',
  fn: DictionaryService
};
