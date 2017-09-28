ionicApp.controller('currentAppointmentCtrl', function($scope,$rootScope,$state,$stateParams,$firebaseObject,$ionicPopup,UserService,$firebaseArray,$ionicModal,$timeout) {
      var userId = $stateParams.userId;
      $scope.userProfile = UserService.getUser();  
      var barberRef = firebase.database().ref().child("barber").child($scope.userProfile.userID);
      $scope.userHairCutting = {
        style : "",
        stylePrice : "",
        selectedDate : "Please select a date"
      };
      $scope.barberObject = $firebaseObject(barberRef);
      var booking = firebase.database().ref().child("Booking");
      $scope.userProfile = UserService.getUser();  
      $scope.bookingArray = $firebaseArray(booking);
      $scope.userHaveBooking = false;
      $scope.getBooking = function(){
      $scope.bookingArray.$loaded().then(function(success) {
            var matchFound = false;
            for(var i = 0 ; i < success.length ; i++){
                    if(success[i].userId == $scope.userProfile.userID && success[i].appointment == "isNotDone" ){
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
      $scope.getBooking();
});