'use strict';

const AppSettings = {
  APP_TITLE: 'Wordo Application',
  WIKTIONARY_URL: '//en.wiktionary.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content',
  FIREBASE_URL: '//wordos.firebaseio.com/',
  FB_APP_ID: '1655549491364311',//1653193178266609
  FB_APP_SECRET: '94339ca47b4b28c646771f7d9bddf8cb',
  COLLECTION : {
    PROFILE: 'Profiles'
  }
};

module.exports = AppSettings;
