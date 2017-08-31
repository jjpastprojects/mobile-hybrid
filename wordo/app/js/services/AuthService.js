'use strict';

function AuthService($rootScope, $facebook) {
  'ngInject';

  var profileInfo = {};

  let service = {};
  service.isAuthenticated = function() {
    return profileInfo.isLoggedIn;
  };

  service.getProfile = function() {
    return profileInfo;
  };

  service.login = function() {
    return new Promise((resolve, reject) => {
      $facebook.api("/me").then(
        function(response) {
          console.log(JSON.stringify(response));
          profileInfo.name = response.name;
          profileInfo.id = response.id;
          profileInfo.isLoggedIn = true;
          resolve(profileInfo);
        },
        function(err) {
          console.log(JSON.stringify(err));
          profileInfo.isLoggedIn = false;
          reject(err, false);
        });
    });
  };

  service.logout = function() {
    return new Promise((resolve, reject) => {
      $facebook.logout().then(
        function(response) {
          console.log(JSON.stringify(response));
          profileInfo = {};
          profileInfo.isLoggedIn = false;
          profileInfo.id = null;
          resolve(profileInfo);
        },
        function(err) {
          console.log(JSON.stringify(err));
          profileInfo.isLoggedIn = false;
          reject(err, false);
        });
    });
  };

  return service;
}

module.exports = {
  name: 'AuthService',
  fn: AuthService
};
