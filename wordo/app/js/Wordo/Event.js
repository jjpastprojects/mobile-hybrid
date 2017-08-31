'use strict';

var EVENT_TYPE = {
  loginSuccess: 'loginSuccess',
  loginFailed: 'loginFailed',
  logoutSuccess: 'logoutSuccess',
  sessionTimeout: 'sessionTimeout',
  notAuthenticated: 'notAuthenticated',
  notAuthorized: 'notAuthorized'
};

function createEventMsg(eventType, sourceData) {
  return {
    'eventType': eventType,
    'sourceData': sourceData
  }
}


module.exports = {
  'name': "Event",
  'public': [createEventMsg],
  'publicState': [{
    'EVENT_TYPE': EVENT_TYPE
  }],
  'private': []
};
