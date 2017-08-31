angular.module('social.finance.services', [])

.factory('Auth', ['$q', '$http', 'URL', function($q, $http, URL) {
    return {
        register: function(data, success, error) {
            $http.post(URL.api + 'register', data).success(success).error(error);
        },
        login: function(data,success,error) {
            $http.post(URL.api + 'login', data).success(success).error(error);
        },
        logout: function(success,error) {
            $http.get(URL.api + 'logout').success(success).error(error);
        },
        token: function(){
            return localStorage.getItem(URL.APP_PREFIX+'token');
        }
    };
}])

.factory('Transactions', ['$q', '$http', 'URL', 'Auth', '$rootScope', function($q, $http, URL, Auth, $rootScope) {

    return {
    	all: function(success, error) {
            var deferred = $q.defer();
            $http.post(URL.api + 'transactions?token='+Auth.token(),{}).success(function(response){
                deferred.resolve(response);
            }).error(function(error){
                $rootScope.$broadcast('request:failed', error);
            });
            return deferred.promise;
        },
        send: function(data) {
            var deferred = $q.defer();
            $http.post(URL.api + 'transaction/commit?token='+Auth.token(),data).success(function(response){
                deferred.resolve(response);
            }).error(function(error){
                $rootScope.$broadcast('request:failed', error);
            });
            return deferred.promise;
        }
    };
}])

.factory('cards', ['$q', '$http', 'URL', 'Auth','$rootScope', function($q, $http, URL, Auth, $rootScope) {
    return {
    	all: function(success, error) {
            var deferred = $q.defer();
            $http.post(URL.api + 'user/cards?token='+Auth.token(),{}).success(function(response){
				deferred.resolve(response);
            }).error(function(error){
                $rootScope.$broadcast('request:failed', error);
            });
            return deferred.promise;
        }
    };
}]);