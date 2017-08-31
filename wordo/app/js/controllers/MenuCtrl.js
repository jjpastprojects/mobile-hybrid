'use strict';

function MenuCtrl($scope, $facebook, AuthService, ModalService) {
  'ngInject';

  $scope.caret = 'caret';

  $scope.isLoggedIn = false;

  $scope.logout = function() {
    AuthService.logout().then(function(responseProfile) {
      $scope.$apply(function() {
        $scope.profileName = responseProfile.name;
        $scope.isLoggedIn = responseProfile.isLoggedIn;
      });

    });
  };

  AuthService.login().then(function(responseProfile) {
    $scope.$apply(function() {
      $scope.profileName = responseProfile.name;
      $scope.isLoggedIn = responseProfile.isLoggedIn;
    });
  });


  $scope.login = function() {

    // Just provide a template url, a controller and call 'showModal'.
    ModalService.showModal({
      templateUrl: "modal/LoginModal.html",
      controller: "LoginModalCtrl"
    }).then(function(modal) {
      console.log("I am called>>");
      // The modal object has the element built, if this is a bootstrap modal
      // you can call 'modal' to show it, if it's a custom modal just show or hide
      // it as you need to.
      modal.element.modal();
      modal.close.then(function(result) {
        console.log("I am modal closedcalled>>");
        $scope.message = result ? "You said Yes" : "You said No";
      });
    });

  };
}

module.exports = {
  name: 'MenuCtrl',
  fn: MenuCtrl
};
