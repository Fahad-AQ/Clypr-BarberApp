ionicApp.controller('dashboardCtrl', function($scope,$rootScope, $stateParams,authService,$ionicPopup,$state,UserService,$firebaseObject,$firebaseArray,$timeout,$ionicHistory) {  
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();
          var userId  = $stateParams.id;
          var userRef = firebase.database().ref().child("barber").child(userId);
          $rootScope.userRef = {};
          $scope.userProfile = UserService.getUser();  
          var barbersRef = firebase.database().ref().child("barber");
          $scope.barbersArray = $firebaseArray(barbersRef);
          var barbersBookedRef = firebase.database().ref().child("Booking");
          $scope.barbersBookedArray = $firebaseArray(barbersBookedRef);    
          $scope.userHaveBooking = false;
          $scope.barberHaveBooking = false;
          $rootScope.userRef = $firebaseObject(userRef);
          $scope.objectBarber = $scope.userProfile;
          $rootScope.userRef.$loaded().then(function(success) {
            if(success.type =='barber'){
               var userRef = firebase.database().ref().child("barber").child(userId);
                $rootScope.userRef = $firebaseObject(userRef);
                $rootScope.userRef.$loaded().then(function(success) {
                  $timeout(function(){
                      $rootScope.userRef = success;
                  },0);
                  

                })
              }
              else{
                var userRef = firebase.database().ref().child("users").child(userId);
                $rootScope.userRef = $firebaseObject(userRef);
                $rootScope.userRef.$loaded().then(function(success) {
                    $timeout(function(){
                      $rootScope.userRef = success;
                  },0);  
              })
                  
               
              }
           })
          $scope.checkBarberBooking = function (){
          $scope.barbersBookedArray.$loaded().then(function(success) {
                var matchFound = false;
                for(var i = 0 ; i < success.length ; i++){
                        if(success[i].appointment == "isNotDone" ){
                            matchFound = true;
                            $scope.userHaveBooking = true;
                            break;
                        }
                  }
                  
                  if(matchFound == false){
                            $scope.userHaveBooking = false;
                  }
                  });
           }
           
           $scope.checkBarberBooking();
           $scope.getBarberBooking = function (){
           $scope.barbersBookedArray.$loaded().then(function(success) {
                var matchFound = false;
                for(var i = 0 ; i < success.length ; i++){
                        if(success[i].barberId == $scope.userProfile.userID && success[i].appointment == "isNotDone" ){
                            matchFound = true;
                            $scope.barberHaveBooking = true;
                            break;
                        }
                  }
                  
                  if(matchFound == false){
                            $scope.barberHaveBooking = false;
                  }
                  });
           }
           
           $scope.getBarberBooking();
           $scope.doneAppointment = function (booking){
            var confirmPopup = $ionicPopup.confirm({
                                                  title: 'Appointment done Option',
                                                  template: 'Are you sure this appointment has been done?'
                                                });

                  confirmPopup.then(function(res) {
                  if(res) {
                  $scope.barbersBookedArray.$loaded().then(function(success) {
                  var matchFound = false;
                        for(var i = 0 ; i < success.length ; i++){
                              if(success[i].barberId == $scope.userProfile.userID && success[i].userEmail == booking.userEmail && success[i].selectedDate == booking.selectedDate){
                                    matchFound = true;
                                    success[i].appointment = "done";                      
                                    $scope.barbersBookedArray.$save(success[i]);
                                    $scope.checkBarberBooking();
                                    $scope.getBarberBooking();
                                    break;
                              }
                        }

                        if(matchFound == false){
                                    $scope.haveBooking = false;
                                    $scope.barberHaveBooking = false;
                        }
                  });
                  }
                  else {


                  }                                  
               })
      
      }
      
      $scope.sendTip = function(bookingUser) {
      $scope.data = {}
    
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "number" placeholder="$dollar Tips" ng-model = "data.model">',
         title: 'Tips',
         subTitle: 'Barber Tips Give By User',
         scope: $scope,
			
         buttons: [
            { text: 'Cancel' }, {
               text: '<b>Save</b>',
               type: 'button-positive',
                  onTap: function(e) {
				if($scope.data.model){
                         $state.go('app.tipCharge' , { 
                                                              barberId   : bookingUser.barberId,
                                                              userId   : bookingUser.userId,
                                                              date   : bookingUser.selectedDate,
                                                              tip : $scope.data.model
                                                              
                                                            });
                        }
                     

                  }
            }
         ]
      });

      myPopup.then(function(res) {
         console.log('Tapped!', res);
      });    
   };
       $scope.cencelAppointment = function (booking){
            var confirmPopup = $ionicPopup.confirm({
                                                  title: 'Appointment Cencel Option',
                                                  template: 'Are you sure this appointment has been Cencel?'
                                                });

                  confirmPopup.then(function(res) {
                  if(res) {
                  $scope.barbersBookedArray.$loaded().then(function(success) {
                  var matchFound = false;
                        for(var i = 0 ; i < success.length ; i++){
                              if(success[i].userId == $scope.userProfile.userID && success[i].userEmail == booking.userEmail && success[i].selectedDate == booking.selectedDate){
                                    matchFound = true;
                                    success[i].appointment = "cencel";                      
                                    $scope.barbersBookedArray.$save(success[i]);
                                    $scope.checkBarberBooking();
                                    $scope.getBarberBooking();
                                    break;
                              }
                        }

                        if(matchFound == false){
                                    $scope.haveBooking = false;
                                    $scope.barberHaveBooking = false;
                        }
                  });
                  }
                  else {


                  }                                  
               })
      
      }
      $scope.cencelByAppointment = function (booking){
            var confirmPopup = $ionicPopup.confirm({
                                                  title: 'Appointment Cencel Option',
                                                  template: 'Are you sure this appointment has been Cencel?'
                                                });

                  confirmPopup.then(function(res) {
                  if(res) {
                  $scope.barbersBookedArray.$loaded().then(function(success) {
                  var matchFound = false;
                        for(var i = 0 ; i < success.length ; i++){
                              if(success[i].barberId == $scope.userProfile.userID && success[i].userEmail == booking.userEmail && success[i].selectedDate == booking.selectedDate){
                                    matchFound = true;
                                    success[i].appointment = "cencel";                      
                                    $scope.barbersBookedArray.$save(success[i]);
                                    $scope.checkBarberBooking();
                                    $scope.getBarberBooking();
                                    break;
                              }
                        }

                        if(matchFound == false){
                                    $scope.haveBooking = false;
                                    $scope.barberHaveBooking = false;
                        }
                  });
                  }
                  else {


                  }                                  
               })
      
      }
      
          $scope.updateSelection = function(position,array,object) {
           $scope.objectBarber = object;
           angular.forEach(array, function(subscription, index) {
                  if (position != index) 
                    subscription.checked = false;
                    array.$save(subscription);
                    $scope.checkBarberBooking();
                });
          }
           $scope.getTimeFunction = function(date,time){
              var matchFound = false;
              for (var i = 0; i < $scope.barbersArray.length; i++) {
              if($scope.barbersArray[i].selectedDate == date && $scope.barbersArray[i].availableTime == time && $scope.barberBookedArray[i].appointment == "isNotDone"){
                      matchFound = true;
                      return true;
                      break;
                    }

              }
              if(matchFound === false){
                return false;
              }

      }
         $scope.doSearchBarber = function() {
          //Going to Search Barber
              $state.go('app.search');
          }

          $scope.doLogOut = function(user) {
          authService.logout();
          $scope.barberLogin = false;
          //Remove localStorage
          window.localStorage.removeItem('starter_user');
          $rootScope.userRef = {};
          $scope.objectBarber = {};
          $state.go('home');
            };

});