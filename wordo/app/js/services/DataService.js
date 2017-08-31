'use strict';
import 'firebase';

function DataService(AppSettings, $firebaseObject, $firebaseArray, $resource, localStorageService, AuthService) {
  'ngInject';

  let service = {};

  service.getWrdHistoryList = function() {
    var wordList = localStorageService.get('words');
    if (wordList) {
      wordList = wordList.reverse();
      return wordList.slice(0, 10);
    }
    return [];
  }

  service.putWrdInHistory = function(word) {
    var wordList = localStorageService.get('words');
    if (wordList) {
      wordList.push(word);
    } else {
      wordList = [];
    }
    localStorageService.set('words', wordList);
  }


  service.getLikedWords = function(searchParam) {
    return new Promise((resolve, reject) => {
      let profile = AuthService.getProfile();
      if (!profile.isLoggedIn) {
        resolve([]);
        return;
      }
      var ref = new Firebase(AppSettings.FIREBASE_URL + AppSettings.COLLECTION.PROFILE + '/' + profile.id + '/likes');
      let parsedArray = []
      ref.orderByChild("updatdTime").limitToLast(10).once('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
          parsedArray.push(childSnapshot.val());
        });
        console.log(parsedArray);
        parsedArray.sort(function(a, b) {
          return b.updatdTime - a.updatdTime;
        });
        resolve(parsedArray);
      }, (error) => {
        reject(err, "status");
      });
    });
  };

  service.saveLikedWord = function(likedObj) {
    return new Promise((resolve, reject) => {
      let profile = AuthService.getProfile();
      if (!profile.isLoggedIn) {
        resolve([]);
        return;
      }
      console.log(profile);
      var ref = new Firebase(AppSettings.FIREBASE_URL);
      var likedWrdsPrfl = $firebaseObject(ref.child(AppSettings.COLLECTION.PROFILE).child(profile.id).child('likes').child(likedObj));
      likedWrdsPrfl.word = likedObj;
      likedWrdsPrfl.updatdTime = new Date().getTime();
      likedWrdsPrfl.$save().then(function(ref) {
        resolve(ref);
      }, function(error) {
        reject(err, "status");
      });
    });
  };

  service.checkForLike = function(likedObj) {
    return new Promise((resolve, reject) => {
      let profile = AuthService.getProfile();
      if (!profile.isLoggedIn) {
        resolve(false);
        return;
      }
      var ref = new Firebase(AppSettings.FIREBASE_URL);
      var likedWrdsPrfl = $firebaseObject(ref.child(AppSettings.COLLECTION.PROFILE).child(profile.id).child('likes').child(likedObj));
      likedWrdsPrfl.$loaded(function() {
        var dataExists = likedWrdsPrfl.$value !== null;
        resolve(dataExists);
      });
    });
  }
  return service;
}

module.exports = {
  name: 'DataService',
  fn: DataService
};
