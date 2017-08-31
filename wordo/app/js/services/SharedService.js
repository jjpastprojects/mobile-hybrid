'use strict';

function SharedService($rootScope) {
  'ngInject';
  let service = {};
  service.prepForBroadcast = function(event, sourceData) {
    this.message = sourceData;
    this.broadcastItem(sourceData);
  };
  service.broadcastItem = function(msg) {
    $rootScope.$broadcast('WORD_SUBMITED', {
      message: msg
    });
  };
  return service;
}

module.exports = {
  name: 'SharedService',
  fn: SharedService
};
