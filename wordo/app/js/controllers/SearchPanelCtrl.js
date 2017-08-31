'use strict';

function SearchPanelCtrl(SharedService, $scope, $stateParams, $state, $facebook, DataService, AuthService) {
  'ngInject';

  $scope.modifyParentScope = function(variable) {
    $scope.searchParam = variable;
  }

  $scope.historyWords = [];
  $scope.selectedI = 0;

  $scope._tabMode = 'history';

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
    $scope.historyWords = DataService.getWrdHistoryList();
  };
}

module.exports = {
  name: 'SearchPanelCtrl',
  fn: SearchPanelCtrl
};
