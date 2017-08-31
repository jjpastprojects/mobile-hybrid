'use strict';


function WordDetailCtrl(DictionaryService, DataService, $scope, $stateParams, $timeout, AuthService, ModalService) {
  'ngInject';

  let LIKED_WORD = "fa fa-heart fa-3x red-color";
  let UNKNOWN_WORD = "fa fa-heart fa-3x";
  $scope.likeWordClass = UNKNOWN_WORD;

  //wiil provide alert message, if user click Like button, but not loged in
  let UNAUTHENTICATE_WORD_LIKE = 'Hey, You are not logged in. Please Login to Like the word!!';

  //get parameter by reading url
  $scope.searchWord = $stateParams.searchWord;
  //provide hook to update the parent compaonent
  $scope.modifyParentScope($scope.searchWord);

  /*
  Check the word, if It is liked by the active user
  */
  $scope.checkForLike = function(message) {
    DataService.checkForLike(message).then(function(responseMsg) {
        console.log("responseMsg " + responseMsg);
        if (responseMsg) {
          $scope.$apply(function() {
            $scope.likeWordClass = LIKED_WORD;
          });
        }
      })
      .catch(function(err, status) {
        console.log("Problem succesfully" + err);
      });
  };
  /*
  Intialization code for word panel
  */
  $scope.initialize = function() {
    $scope.searchWord = $scope.searchWord;
    DictionaryService.get($scope.searchWord).then(function(responseMsg) {
        $scope.$apply(function() {
          $scope.wordDetails = responseMsg;
        });
      })
      .catch(function(err, status) {
        $scope.$apply(function() {
          $scope.wordDetails = {
            error: ['No Data Found!!']
          };
        });
      });

  };

  $scope.initialize();
  $scope.checkForLike($scope.searchWord);

  /*
  Method use to like a word
  */
  $scope.likeWord = function() {
    $scope.showAModal();
    $scope.profile = AuthService.getProfile();
    console.log(JSON.stringify($scope.profile));
    console.log("$scope.profile.isLoggedIn : " + $scope.profile.isLoggedIn);

    if (!$scope.profile.isLoggedIn) {
      $scope.alertMsg = "Not Autheticated";
      return;
    }
    $scope.likeWordClass = LIKED_WORD;
    DataService.saveLikedWord($scope.searchWord).then(function(responseMsg) {})
      .catch(function(err, status) {
        console.log("Problem succesfully" + err);
      });
  };

  $scope.showAModal = function() {

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
  name: 'WordDetailCtrl',
  fn: WordDetailCtrl
};
