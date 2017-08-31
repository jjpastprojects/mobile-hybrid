'use strict';

function LoginModalCtrl($scope, $element, close, $facebook, AuthService) {
  'ngInject';

  $scope.dismissModal = function(result) {
    console.log("I am closed>>");
    $element.modal('hide');
    close(result, 200);
  };

  $scope.login = function() {
    $facebook.login().then(function() {
      AuthService.login().then(function(responseProfile) {
        $scope.$apply(function() {
          $scope.profileName = responseProfile.name;
          $scope.isLoggedIn = responseProfile.isLoggedIn;
          $element.modal('hide');
          close("result", 200);
        });
      });
    });
  }
}

module.exports = {
  name: 'LoginModalCtrl',
  fn: LoginModalCtrl
};
