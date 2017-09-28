'use strict';

var ionicApp = angular.module('clypr', ['ionic','ionic-material', 'ionMdInput','firebase','ngCordova','ngCordovaOauth','ionic-datepicker','angular-stripe','ionic.rating'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) { 
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
   
   
  var config = {
    apiKey: "Your-firebase-apiKey",
    authDomain: "Your-firebase-authDomain",
    databaseURL: "Your-firebase-databaseURL",
    storageBucket: "Your-firebase-storageBucket",
    messagingSenderId: "Your-firebase-messagingSenderId"
  };
  
  firebase.initializeApp(config);

 
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html', // main first Index Page
    controller: 'homeCtrl'
  })

  .state('barber', {
    url: '/barberLogin',
    templateUrl: 'templates/barberLogin.html', // barber Login Page
    controller: 'barberLoginCtrl'
  })

.state('barberRegister', {
    url: '/barberRegister',
    templateUrl: 'templates/barberRegister.html',  // barber Register Page
    controller: 'barberRegisterCtrl'
  })
.state('booking', {
    url: '/booking',
    templateUrl: 'templates/bookBarber.html',  // barber Register Page
    controller: 'bookingCtrl'
  })

.state('customer', {
    url: '/login',
    templateUrl: 'templates/login.html', // customer Login Page
    controller: 'loginCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html', // register Login Page
    controller: 'registerCtrl'
  })


  
 .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',  // app abstract page
    controller: 'AppCtrl'
  })

 .state('app.dashboard', {
      url: '/dashboard/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html', // app dashboard page
          controller: 'dashboardCtrl'
        }
      }
    })
  
  .state('app.search', {
    url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html', // app search page
          controller: 'searchCtrl'
        }
      }
  })

  .state('app.barberProfile', {
    url: '/barberProfile/:barberId',
     views: {
      'menuContent': {
          templateUrl: 'templates/barberProfile.html', // app barberProfile page
          controller: 'barberProfileCtrl'
      }
     }
  })
  
  .state('app.editBarberProfile', {
    url: '/editBarberProfile/:barberId',
     views: {
      'menuContent': {
        templateUrl: 'templates/editBarberProfile.html',  // barber Register Page
        controller: 'editBarberProfileCtrl'
      }
     }
     })
  
  .state('app.booking', {
    url: '/booking/:barberId/:userId',
     views: {
      'menuContent': {
        templateUrl: 'templates/bookBarber.html',  // barber Register Page
        controller: 'bookingCtrl'
      }
     }
 
  })
  
    
  .state('app.appointmentSetting', {
    url: '/appointmentSetting/:barberId',
     views: {
      'menuContent': {
        templateUrl: 'templates/appointmentSetting.html',  // barber Register Page
        controller: 'appointmentSettingCtrl'
      }
     }
 
  })
  
 .state('app.barberAppointments', {
    url: '/barberAppointments/:userId',
     views: {
      'menuContent': {
        templateUrl: 'templates/barberAppointments.html',  // barber Register Page
        controller: 'barberAppointmentsCtrl'
      }
     }
  })
   .state('app.orderHistory', {
    url: '/orderHistory/:userId',
     views: {
      'menuContent': {
        templateUrl: 'templates/orderHistory.html',  // barber Register Page
        controller: 'orderHistoryCtrl'
      }
     }
  })
  
  .state('app.appointmentHistory', {
    url: '/appointmentHistory/:userId',
     views: {
      'menuContent': {
        templateUrl: 'templates/appointmentHistory.html',  // barber Register Page
        controller: 'appointmentHistoryCtrl'
      }
     }
  })
  
  .state('app.currentAppointment', {
    url: '/currentAppointment/:userId',
     views: {
      'menuContent': {
        templateUrl: 'templates/currentAppointment.html',  // barber Register Page
        controller: 'currentAppointmentCtrl'
      }
     }
  })
      
  .state('app.locationMap', {
    url: '/locationMap/:barberId',
     views: {
      'menuContent': {
        templateUrl: 'templates/locationMap.html',  // barber Register Page
        controller: 'locationMapCtrl'
      }
     }
 
  })
  
  .state('app.reviews', {
    url: '/reviews/:barberId',
     views: {
      'menuContent': {
        templateUrl: 'templates/reviewsBarber.html',  // barber Register Page
        controller: 'reviewsCtrl'
      }
     }
 
  })
  
  .state('app.orderPlacement', {
    url: '/orderPlacement/:barberId/:userId/:date/:time/:style/:currentDate/:changeDateCount/:tip',
     views: {
      'menuContent': {
        templateUrl: 'templates/orderPlacement.html',  // barber Register Page
        controller: 'orderPlacementCtrl'     
      }
     }
 
  })
    .state('app.changeDateCharge', {
      url: '/changeDateCharge/:barberId/:userId/:date/:time',
      views: {
        'menuContent': {
          templateUrl: 'templates/changeDateCharge.html',  // barber Register Page
          controller: 'changeDateChargeCtrl'     
        }
      }
 
  })
  
   .state('app.tipCharge', {
      url: '/tipCharge/:barberId/:userId/:date/:tip',
      views: {
        'menuContent': {
          templateUrl: 'templates/tipCharge.html',  // barber Register Page
          controller: 'tipChargeCtrl'     
        }
      }
 
  })
  
   .state('app.cardInformation', {
    url: '/cardInformation/:userId',
     views: {
      'menuContent': {
        templateUrl: 'templates/cardInformation.html',  // barber Register Page
        controller: 'cardInformationCtrl'     
      }
     }
 
  })
  .state('app.editUserProfile', {
    url: '/editUserProfile/:userId',
     views: {
      'menuContent': {
        templateUrl: 'templates/editUserProfile.html',  // barber Register Page
        controller: 'editUserProfileCtrl'     
      }
     }
 
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
})
.run(function($rootScope,$state,authService,UserService){
       $rootScope.$on('$stateChangeSuccess', function (ev,toState, toParams, from, fromParams) {
       // user Authenticated Object
        var userAuthenticated = authService.getAuth();
           
           if(toState.name == "customer" && userAuthenticated != null ||toState.name == "register" && userAuthenticated != null ||toState.name == "barber" && userAuthenticated != null ){      
            console.log(from.name)      
            // Stop User to get state todo or Edit Todo if not Authurized
            ev.preventDefault();
            $rootScope.userProfile = UserService.getUser();  
            $state.go("app.dashboard", {'id' : $rootScope.userProfile.userID });
           }

        });
   
   
})
 .constant('CONFIG', {
      stripePublicKey: 'Your-Striper-Key',      
      clyprPushServerURL: 'Your-Clypr-URl',
      clyprServerURL: 'http://10.0.0.181:8100'
    });
