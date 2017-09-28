ionicApp.controller('barberAppointmentsCtrl', function($scope,$rootScope,$state,$stateParams,$firebaseObject,$ionicPopup,UserService,$firebaseArray,$ionicModal,$timeout) {
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
      $scope.barberHaveBooking = false;
      $scope.checkBarberBooking = function (){
      $scope.bookingArray.$loaded().then(function(success) {
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
      $scope.doneAppointment = function (booking){
       var confirmPopup = $ionicPopup.confirm({
                                                  title: 'Appointment done Option',
                                                  template: 'Are you sure this appointment has been done?'
                                                });

                  confirmPopup.then(function(res) {
                  if(res) {
                  $scope.bookingArray.$loaded().then(function(success) {
                  var matchFound = false;
                        for(var i = 0 ; i < success.length ; i++){
                              if(success[i].barberId == $scope.userProfile.userID && success[i].userEmail == booking.userEmail && success[i].selectedDate == booking.selectedDate){
                                    matchFound = true;
                                    success[i].appointment = "done";
                                    $scope.bookingArray.$save(success[i]);
                                    $scope.checkBarberBooking();
                                    break;
                              }
                        }

                        if(matchFound == false){
                                    $scope.barberHaveBooking = false;
                        }
                  });
                  }
                  else {


                  }                                  
               })
      
      }
      
      $scope.checkBarberBooking();
      
});