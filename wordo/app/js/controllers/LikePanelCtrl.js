'use strict';

function LikePanelCtrl(SharedService, $scope, $stateParams, $state, $facebook, DataService, AuthService) {
  'ngInject';
  console.log("******************************************************");
  $scope.modifyParentScope = function(variable) {
    $scope.searchParam = variable;
  }

  $scope.likedWords = [];
  $scope.selectedI = 0;

  $scope._tabMode = 'history';

  $scope.notAuth = function() {
    $scope.tabMode('*********************************')
    return $scope.tabMode('save') && $scope.profile.isAuthenticated;
  }

  $scope.tabMode = function(cmpMode) {
    if ($scope._tabMode == cmpMode) {
      return true;
    }
    return false;
  }

  $scope.chngTabMode = function(cmpMode) {
    $scope._tabMode = cmpMode;
    $scope.selectedI = 0;

    if ($scope._tabMode == 'history') {
      $scope.historyWords = DataService.getWrdHistoryList();
      if ($scope.historyWords[0]) {
        $scope.searchParam = $scope.historyWords[0].word;
      } else {
        $scope.searchParam = 'DEFAULT';
      }
      $state.go('search.searchWord', {
        searchWord: $scope.searchParam
      });
    } else {
      getLikedWords();
    }

  }

  function getHistoryWords() {
    $scope.historyWords = DataService.getWrdHistoryList();
    if ($scope.historyWords[0]) {
      $scope.searchParam = $scope.historyWords[0].word;
    } else {
      $scope.searchParam = 'DEFAULT';
    }
    $state.go('search.searchWord', {
      searchWord: $scope.searchParam
    });
  }
  getHistoryWords();

  function getLikedWords() {
    $scope.profile = AuthService.getProfile();

    if (!$scope.profile.isLoggedIn) {
      $scope.errorMsg = "Not Autheticated";
      return;
    }
    DataService.getLikedWords().then(function(responseMsg) {
        $scope.likedWords = responseMsg;
        if ($scope.likedWords[0]) {
          $scope.searchParam = $scope.likedWords[0].word;
        } else {
          $scope.searchParam = 'DEFAULT';
        }
        $state.go('search.searchWord', {
          searchWord: $scope.searchParam
        });
      })
      .catch(function(err, status) {
        console.log("err : " + err);
      });
  }
  //getLikedWords();

  $scope.search = function(index, mode) {
    console.log("index<<<<<< : " + index)
    if (!(index == 'undefined' || index == null)) {
      console.log("index>>>> : " + index)
      console.log("likedWord : " + index);
      $scope.selectedI = index;
      if ($scope._tabMode == 'history') {
        $scope.searchParam = $scope.historyWords[index].word;
        $scope.historyWords = DataService.getWrdHistoryList();
      } else {
        $scope.searchParam = $scope.likedWords[index].word;
        DataService.getLikedWords().then(function(responseMsg) {
          $scope.likedWords = responseMsg;
        });
      }
    } else {
      $scope.selectedI = 0;

      DataService.putWrdInHistory({
        word: $scope.searchParam
      });

    }
    $state.go('search.searchWord', {
      searchWord: $scope.searchParam
    });
    if ($scope._tabMode == 'history') {
      $scope.historyWords = DataService.getWrdHistoryList();
    } else {
      $scope.profile = AuthService.getProfile();
      if (!$scope.profile.isAuthenticated) {
        DataService.getLikedWords().then(function(responseMsg) {
          $scope.likedWords = responseMsg;
        });
      }

    }
  };
}

module.exports = {
  name: 'LikePanelCtrl',
  fn: LikePanelCtrl
};
