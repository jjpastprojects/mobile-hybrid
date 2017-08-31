angular.module('social.finance.controllers', [])
.controller('AuthCtrl', function($scope) {
})
.controller('AppCtrl', function($scope, $rootScope, $state, $window) {
    $rootScope.doLogout = function() {
        $window.localStorage.clear();
        $state.go('auth.welcome');
    };
    $rootScope.userActiveCard = [];

    $scope.faqs = [{
            'ques': "Housing",
            'ans': 'Computer  Crew Domestic'
        },

        {
            'ques': "Jobs",
            'ans': 'Computer Creative Crew '
        }, {
            'ques': "Gigs",
            'ans': 'Domestic'
        }
    ];


    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
})
.controller('ReceiveCtrl', function($rootScope, $scope, cards, Transactions, $ionicModal) {
    $scope.loadCards = function() {
        cards.all().then(function(data) {
            $scope.fromCards = data.data;
        });
    };

    $scope.depositAddress = '';

    $scope.loadCards();
})
.controller('ConvertCtrl', function($rootScope, $scope, cards, Transactions, $ionicModal) {

    $scope.resetDetails = function() {
        $scope.convertDetails = {
            'fromAddress' : '',
            'toAddress' : '',
            'amount' : ''
        };
    };

    $scope.resetDetails();

    $scope.btnConvert = {
        process: false,
        caption: 'Submit',
        error: 0,
        errors: [],
        msg: ''
    };

    $scope.doConvert = function() {
        $scope.errors = [];
        $scope.btnConvert.caption = 'Processing, please wait...';
        $scope.btnConvert.process = true;
        var transactionDetails = {
            address: $scope.convertDetails.toAddress,
            cardAddress: $scope.convertDetails.fromAddress,
            amount: $scope.convertDetails.amount,
            description: '',
            action: 'convert'
        };

        Transactions.send(transactionDetails).then(function(response) {
            $scope.btnConvert.caption = 'Submit';
            $scope.btnConvert.process = false;
            if (response.status === 0) {
                $scope.btnConvert.error = true;
                $scope.btnConvert.errors = response.errors;
            } else {
                $scope.btnConvert.error = false;
                $scope.btnConvert.errors = ['Done converting card values.'];
                $scope.resetDetails();
                $scope.loadCards();
            }

        });
    };

    $scope.fromCardSymbol = '';
    $scope.changeFromCard = function(){
        if($scope.convertDetails.toAddress == $scope.convertDetails.fromAddress)
            $scope.convertDetails.toAddress = '';

        $scope.toCards = [];
        angular.forEach($scope.fromCards, function(val, i) {
            if (val.address != $scope.convertDetails.fromAddress) {
                $scope.toCards.push(val);
            }else{
                $scope.fromCardSymbol = val.symbol;
            }
        });
    };

    $scope.loadCards = function() {
        cards.all().then(function(data) {
            $scope.fromCards = data.data;
        });
    };

    $scope.loadCards();
})
.controller('SendCtrl', function($rootScope, $scope, cards, Transactions, $ionicModal, $cordovaBarcodeScanner) {
    $scope.cardToUse = $rootScope.userActiveCard;
    $scope.newCard = $scope.cardToUse;
    $scope.cardSelected = {
        address: $scope.newCard.address
    };

    $scope.resetDetails = function() {
        $scope.transactionDetails = {
            address: '',
            cardAddress: $scope.cardToUse.address,
            amount: '',
            description: '',
            action: 'send'
        };
    };

    $scope.resetDetails();

    $scope.loadCards = function() {
        cards.all().then(function(data) {
            $scope.cards = data.data;
            angular.forEach($scope.cards, function(val, i) {
                if (val.address == $scope.cardToUse.address) {
                    $scope.cardToUse.formatted_balance = val.formatted_balance;
                }
            });
            $ionicModal.fromTemplateUrl('views/app/modal-cards-list.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modalCardsList = modal;
            });
        });
    };
    $scope.loadCards();

    $scope.btnSend = {
        process: false,
        caption: 'Send',
        error: 0,
        errors: [],
        msg: ''
    };

    $scope.doSend = function() {
        $scope.errors = [];
        $scope.btnSend.caption = 'Processing, please wait...';
        $scope.btnSend.process = true;
        Transactions.send($scope.transactionDetails).then(function(response) {
            $scope.btnSend.caption = 'Send';
            $scope.btnSend.process = false;
            if (response.status === 0) {
                $scope.btnSend.error = true;
                $scope.btnSend.errors = response.errors;
            } else {
                $scope.btnSend.error = false;
                $scope.btnSend.errors = ['Sent'];
                $scope.resetDetails();
            }

            $scope.loadCards();

        });
    };

    $scope.showCards = function() {
        $scope.modalCardsList.show();
    };

    $scope.hideCards = function() {
        $scope.modalCardsList.hide();
        angular.forEach($scope.cards, function(val, i) {
            if (val.address == $scope.cardSelected.address) {
                $scope.cardToUse = val;
            }
        });
        //$scope.cardToUse = $scope.newCard;
        $scope.transactionDetails.cardAddress = $scope.cardToUse.address;
    };

    $scope.doqrcode = function(){
        $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
            $scope.putTextfromBarCode(barcodeData.text);
            // Success! Barcode data is here
          }, function(error) {
            // An error occurred
          });
    };

    $scope.putTextfromBarCode = function(text){

    };

})
.controller('SocialCtrl', function($rootScope, $scope, $ionicModal, $ionicSlideBoxDelegate, $ionicLoading, cards, Transactions) {
    $scope.activeTab = 'tab1';

    $scope.setBackDimensions = function() {
        $scope.slideBoxHeight = document.getElementById('image-slide-1').height;
        console.log($scope.slideBoxHeight);
        return { 'height': $scope.slideBoxHeight + 'px' };
    };

    $scope.setBackDimensions2 = function() {
        $scope.slideBoxHeight = document.getElementById('image-slide-2').height;
        console.log($scope.slideBoxHeight);
        return { 'height': $scope.slideBoxHeight + 'px' };
    };

    $scope.loadCards = function() {
        cards.all().then(function(data) {
            if (data.message == "OK") {
                $scope.sliderImages = data.data;
                $ionicSlideBoxDelegate.$getByHandle('slider-1').update();
                $ionicSlideBoxDelegate.$getByHandle('slider-2').update();
            }
        });
    };
    $scope.loadCards();

    $scope.changeTab = function(tab) {
        $scope.activeTab = tab;
    };
})
.controller('WalletCtrl', function($rootScope, $scope, $ionicModal, $ionicSlideBoxDelegate, $ionicLoading, cards, Transactions) {
    
    $scope.filterAllSent = function(transaction){
        return (transaction.sent && !transaction.converted);
    };

    $scope.filterAllReceive = function(transaction){
        return (!transaction.sent && !transaction.converted);
    };

    $ionicLoading.show({
        template: 'Loading...'
    });
    $scope.setBackDimensions = function() {
        $scope.slideBoxHeight = document.getElementById("image-slide-1").height;
        return { 'height': $scope.slideBoxHeight + 'px' };
    };

    $scope.activeTransactionTab = 'all';

    $scope.changeTransactionTab = function(tab) {
       $scope.activeTransactionTab = tab;
    };

    // $scope.changeTransactionTab = function(tab) {
    //     $scope.activeTransactionTab = tab;
    //     var c = $ionicSlideBoxDelegate.slidesCount();
    //     var i = $ionicSlideBoxDelegate.currentIndex();
    //     var next = i + 1;
    //     if (next >= c)
    //         next = 0;
    //     $ionicSlideBoxDelegate.slide(next);
    //     $rootScope.userActiveCard = $scope.sliderImages[next];
    // };

    $scope.loadCards = function() {
        cards.all().then(function(data) {
            if (data.message == "OK") {
                $scope.sliderImages = data.data;
                $ionicSlideBoxDelegate.update();
                $rootScope.userActiveCard = $scope.sliderImages[0];
            }
        });
    };
    $scope.loadCards();

    $ionicModal.fromTemplateUrl('views/app/modal-transaction-details.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalTransactionDetails = modal;
    });

    $scope.cardChanged = function(index) {
        $rootScope.userActiveCard = $scope.sliderImages[index];
    };

    $scope.showDetails = function(transaction) {
        $scope.transactionViewed = transaction;
        $scope.modalTransactionDetails.show();
    };

    $scope.getTransactions = function() {
        Transactions.all().then(function(data) {
            $scope.transactions = data;
            $ionicLoading.hide();
        });
    };
    $scope.getTransactions();

    $scope.doRefresh = function(){
        $scope.transactions = [];
        $scope.getTransactions();
        $scope.$broadcast('scroll.refreshComplete');
    };

})
.controller('WelcomeCtrl', function($scope, $ionicModal, show_hidden_actions, $state) {

    $scope.show_hidden_actions = show_hidden_actions;

    $scope.toggleHiddenActions = function() {
        $scope.show_hidden_actions = !$scope.show_hidden_actions;
    };

    $scope.facebookSignIn = function() {
        console.log("doing facebbok sign in");
        $state.go('app.wallet');
    };

    $scope.googleSignIn = function() {
        console.log("doing google sign in");
        $state.go('app.wallet');
    };

    $scope.twitterSignIn = function() {
        console.log("doing twitter sign in");
        $state.go('app.wallet');
    };

    $ionicModal.fromTemplateUrl('views/partials/privacy-policy.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacy_policy_modal = modal;
    });

    $ionicModal.fromTemplateUrl('views/partials/terms-of-service.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.terms_of_service_modal = modal;
    });

    $scope.showPrivacyPolicy = function() {
        $scope.privacy_policy_modal.show();
    };

    $scope.showTerms = function() {
        $scope.terms_of_service_modal.show();
    };
})
.controller('LogInCtrl', function($scope, $state, Auth, $rootScope, URL) {
    $scope.loginError = function(msg) {
        if (msg.status === 0 || msg.status === false) {
            $scope.errors = msg.errors;
        } else {
            $scope.errors = ['Error accessing API.'];
        }
        $scope.resetLoginButton();
    };

    $scope.resetLoginButton = function() {
        $scope.loginButton.caption = 'Log In';
        $scope.loginButton.process = false;
    };

    $scope.loginSuccess = function(response) {
        $scope.resetLoginButton();
        if (response.status === 0) {
            $scope.errors = response.errors;
        } else {
            console.log(response.token);
            localStorage.setItem(URL.APP_PREFIX + 'token', response.token);
            localStorage.setItem(URL.APP_PREFIX + 'userName', response.data.firstName + ' ' + response.data.lastName);
            localStorage.setItem(URL.APP_PREFIX + 'profilePicture', response.data.profilePicture);

            $rootScope.appUserName = localStorage.getItem(URL.APP_PREFIX + 'userName');
            $rootScope.appProfilePicture = localStorage.getItem(URL.APP_PREFIX + 'profilePicture');
            $state.go('app.wallet');
        }

    };

    $scope.user = {
        email: '',
        password: ''
    };

    $scope.loginButton = {
        process: false,
        caption: 'Log In',
        result: []
    };

    $scope.doLogIn = function() {
        $scope.errors = [];
        $scope.loginButton.caption = 'Processing, please wait...';
        Auth.login($scope.user, $scope.loginSuccess, $scope.loginError);
    };
})
.controller('SignUpCtrl', function($scope, $state, Auth, $rootScope, URL, $ionicPopup) {
    $scope.signUpError = function(msg) {
        if (msg.status === false) {
            $scope.errors = msg.errors;
        } else {
            $scope.errors = ['Error accessing API.'];
        }
        $scope.resetSignUpButton();
    };

    $scope.resetSignUpButton = function() {
        $scope.signUpButton.caption = 'Sign Up';
        $scope.signUpButton.process = false;
    };

    $scope.signUpSuccess = function(response) {
        $scope.resetSignUpButton();
        if (response.status === false) {
            $scope.errors = response.errors;
        } else {
            if(response.status===0){
                $ionicPopup.alert({
                   title: 'Error',
                   template: response.errors[0]
                });
            }else{

                localStorage.setItem(URL.APP_PREFIX + 'token', response.token);
                localStorage.setItem(URL.APP_PREFIX + 'userName', response.data.firstName + ' ' + response.data.lastName);
                localStorage.setItem(URL.APP_PREFIX + 'profilePicture', response.data.profilePicture);

                $rootScope.appUserName = localStorage.getItem(URL.APP_PREFIX + 'userName');
                $rootScope.appProfilePicture = localStorage.getItem(URL.APP_PREFIX + 'profilePicture');


                $state.go('app.wallet');
            }
        }

    };

    $scope.user = {
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '',
        email: '',
        password: ''
    };

    $scope.signUpButton = {
        process: false,
        caption: 'Sign Up',
        result: []
    };

    $scope.doSignUp = function() {
        $scope.errors = [];
        $scope.signUpButton.caption = 'Processing, please wait...';
        Auth.register($scope.user, $scope.signUpSuccess, $scope.signUpError);
    };
})
.controller('ForgotPasswordCtrl', function($scope, $state) {
    $scope.requestNewPassword = function() {
        console.log("requesting new password");
        $state.go('app.wallet');
    };
});
