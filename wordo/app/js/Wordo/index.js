'use strict';

const bulk = require('bulk-require');

const apiList = bulk(__dirname, ['./!(*index|*.spec).js']);

var exposeAPI = {};

Object.keys(apiList).forEach((apiKey) => {
  let api = apiList[apiKey];
  let apiName = api.name;
  let apiObj = {};

  let publicMethods = api['public'];
  for (var i = 0; i < publicMethods.length; i++) {
    let funcName = publicMethods[i].name;
    apiObj[funcName] = publicMethods[i];
  };

  let privateMethods = api['private'];
  for (var i = 0; i < privateMethods.length; i++) {
    let funcName = privateMethods[i].name;
    apiObj['_' + funcName] = privateMethods[i];
  };

  let publicState = api['publicState'];
  if (publicState) {
    for (var i = 0; i < publicState.length; i++) {
      let funcName = publicState[i];
      for (var prop in funcName) {
        apiObj[prop] = funcName[prop];
        break;
      }
    };
  }


  exposeAPI[apiName] = apiObj;
});

module.exports = exposeAPI;
