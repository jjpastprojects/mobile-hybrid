'use strict';

function AboutCtrl($scope) {
  'ngInject';

  $scope.testCtrl = function () {
    return 5;
  };

  $scope.name = 'Awesome Name';
}

module.exports = {
  name: 'AboutCtrl',
  fn: AboutCtrl
};
