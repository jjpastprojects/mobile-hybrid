
angular.module('underscore', [])
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('social.finance', [
    'ionic',
    'social.finance.directives',
    'social.finance.controllers',
    'social.finance.services',
    'social.finance.views',
    'underscore',
    'ngCordova.plugins'
])

.constant('URL', {
       'api': 'http://socialfinance.dreamhosters.com/',
       'APP_PREFIX': 'Social.Finance_'
   })

.filter('unsafe', function($sce) {
    return $sce.trustAsHtml;
})

.run(function($ionicPlatform, $rootScope, $timeout, $ionicConfig, $state, URL, $ionicLoading, $window) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    // This fixes transitions for transparent background views
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('auth.welcome') > -1) {
            // set transitions to android to avoid weird visual effect in the walkthrough transitions
            $timeout(function() {
                $ionicConfig.views.transition('android');
                $ionicConfig.views.swipeBackEnabled(false);
                console.log("setting transition to android and disabling swipe back");
            }, 0);
        }

        if(localStorage.getItem(URL.APP_PREFIX+'token') === null && toState.authenticate ){
            if(toState.name=='app.wallet' && fromState.name=='auth.signup'){

            }else{
                console.log('should not be here');
                $rootScope.$broadcast('request:un-authorise');
            }
        }
    });
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('app.wallet') > -1) {
            // Restore platform default transition. We are just hardcoding android transitions to auth views.
            $ionicConfig.views.transition('platform');
            // If it's ios, then enable swipe back again
            if (ionic.Platform.isIOS()) {
                $ionicConfig.views.swipeBackEnabled(true);
            }
            console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
        }
    });

    if(localStorage.getItem(URL.APP_PREFIX+'token') !== null){
        $rootScope.appProfilePicture = localStorage.getItem(URL.APP_PREFIX+'profilePicture');
        $rootScope.appUserName = localStorage.getItem(URL.APP_PREFIX+'userName');
    }

    $rootScope.$state = $state;

    $rootScope.$on('request:failed', function(e,error) {
        $ionicLoading.hide();
        $window.localStorage.clear();
        $state.go('auth.welcome');
    });

    $rootScope.$on('request:un-authorise', function(e) {
        $window.localStorage.clear();
        window.location = "#/auth/welcome";
    });
})


.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('auth', {
        url: "/auth",
        authenticate: false,
        templateUrl: "views/auth/auth.html",
        controller: "AuthCtrl",
        abstract: true
    })

    .state('auth.welcome', {
        url: '/welcome',
        authenticate: false,
        templateUrl: "views/auth/welcome.html",
        controller: 'WelcomeCtrl',
        resolve: {
            show_hidden_actions: function() {
                return false;
            }
        },
        onEnter: function($state,URL){
            if(localStorage.getItem(URL.APP_PREFIX+'token') !== null){
               $state.go('app.wallet');
            }
        }
    })

    .state('auth.login', {
        url: '/login',
        authenticate: false,
        templateUrl: "views/auth/login.html",
        controller: 'LogInCtrl'
    })

    .state('auth.signup', {
        url: '/signup',
        authenticate: false,
        templateUrl: "views/auth/signup.html",
        controller: 'SignUpCtrl'
    })

    .state('auth.forgot-password', {
        url: '/forgot-password',
        authenticate: false,
        templateUrl: "views/auth/forgot-password.html",
        controller: 'ForgotPasswordCtrl'
    })

    .state('app', {
        url: "/app",
        abstract: true,
        authenticate: true,
        templateUrl: "views/app/side-menu.html",
        controller: 'AppCtrl'
    })

    .state('app.wallet', {
        url: "/wallet",
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: "views/app/wallet.html",
                controller: 'WalletCtrl'
            }
        }
    })

    .state('app.send', {
        url: '/send',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'views/app/send.html',
                controller: 'SendCtrl'
            }
        }
    })

    .state('app.convert', {
        url: '/convert',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'views/app/convert.html',
                controller: 'ConvertCtrl'
            }
        }
    })

    .state('app.receive', {
        url: '/receive',
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: 'views/app/receive.html',
                controller: 'ReceiveCtrl'
            }
        }
    })

    .state('app.social', {
            url: '/social',
            authenticate: true,
            views: {
                'menuContent': {
                    templateUrl: 'views/app/social.html',
                    controller: 'SocialCtrl'
                }
            }
        })
        .state('app.local', {
            url: '/local',
            authenticate: true,
            views: {
                'menuContent': {
                    templateUrl: 'views/app/local.html',
                    controller: 'AppCtrl'
                }
            }
        })

    .state('app.contacts', {
            url: '/contacts',
            authenticate: true,
            views: {
                'menuContent': {
                    templateUrl: 'views/app/contacts.html',
                    controller: 'AppCtrl'
                }
            }
        })
        .state('app.settings', {
            url: '/settings',
            authenticate: true,
            views: {
                'menuContent': {
                    templateUrl: 'views/app/settings.html',
                    controller: 'AppCtrl'
                }
            }
        })
        .state('app.help', {
            url: '/help',
            authenticate: true,
            views: {
                'menuContent': {
                    templateUrl: 'views/app/help.html',
                    controller: 'AppCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/auth/welcome');
})

;
