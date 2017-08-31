'use strict';

function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $facebookProvider, AppSettings, localStorageServiceProvider) {
  'ngInject';




  $facebookProvider.setAppId(AppSettings.FB_APP_ID);
  localStorageServiceProvider.setPrefix('wordo');

  $stateProvider
    .state('about', {
      url: '/_about',
      controller: 'AboutCtrl',
      templateUrl: 'About.html',
    })
    .state('search', {
      url: '',
      controller: 'SearchPanelCtrl',
      templateUrl: 'SearchPanel.html',
    })
    .state('search.searchWord', {
      url: '/:searchWord',
      controller: 'WordDetailCtrl',
      templateUrl: 'WordDetail.html',
    }).state('like', {
      url: '',
      controller: 'LikePanelCtrl',
      templateUrl: 'LikePanel.html',
    });

  $urlRouterProvider.otherwise('/');

  // use the HTML5 History API
  $locationProvider.html5Mode(true);
}

module.exports = OnConfig;
