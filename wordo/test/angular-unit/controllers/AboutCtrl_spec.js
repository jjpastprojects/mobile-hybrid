/*global angular */

'use strict';

describe('Unit: AboutCtrl', function() {

  var ctrl, scope;

  beforeEach(function() {
    // instantiate the app module
    angular.mock.module('Wordo');

    angular.mock.inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('AboutCtrl', {
        $scope: scope
      });
    });
  });

  it('should exist', function() {
    expect(ctrl).toBeDefined();
  });

   it('#testCtrl() should have return 5', function() {
     expect(scope.testCtrl()).toEqual(5);
   });

   it('should have a name variable equal - Awesome Name', function() {
     expect(scope.name).toEqual('Awesome Name');
   });
 
});
