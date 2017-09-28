ionicApp.controller('appointmentSettingCtrl', function($scope,$rootScope,$state,$stateParams,$firebaseObject,$ionicPopup,UserService,$firebaseArray,$ionicModal,$timeout) {
      var barberId = $stateParams.barberId;
      var barberRef = firebase.database().ref().child("barber").child(barberId);
      $scope.userProfile = UserService.getUser();  
      $scope.userHairCutting = {
        style : "",
        stylePrice : "",
        selectedDate : "Please select a date"
      };
      $scope.barberObject = $firebaseObject(barberRef);
      $scope.selectables = $scope.barberObject.cuttingStyle;
      $scope.barberUid = $stateParams.barberId;
      $scope.userStyleRef = {};
      $scope.barberBooking = {
         "startTime" : 9,
         "endTime" : 6,
         "startTimeAMPM" : "AM",
         "endTimeAMPM" : "PM"
      };

      $scope.addCutting = function (cuttingStyle){
          if(cuttingStyle.style != "" && cuttingStyle.stylePrice !=""){
           var barberRef = firebase.database().ref().child("barber").child(barberId).child('cuttingStyle');
           var barberArray = $firebaseArray(barberRef);
           var matchFound = false;
           barberArray.$loaded().then(function(success) {

            for(var i = 0 ; i < success.length ; i++){
                    if(success[i].styleName == cuttingStyle.style.toLowerCase()){
                        matchFound = true;
                        var alertPopup = $ionicPopup.alert({
                          title: 'Style Added Failed',
                          template: 'Style already has been Added'
                        });   
                        $scope.userHairCutting = {
                          style : "",
                          stylePrice : "",
                          selectedDate : "Please select a date"
                        };   
                        break;
                    }
              }
              if(matchFound === false){
                      barberArray.$add(
                        {
                          styleName : cuttingStyle.style.toLowerCase(),
                          stylePrice : cuttingStyle.stylePrice,
                        }           
                      )
                      cuttingStyle = "";
                      $scope.userHairCutting = {
                        style : "",
                        stylePrice : "",
                        selectedDate : "Please select a date"
                      };
                        var alertPopup = $ionicPopup.alert({
                          title: 'Style Added',
                          template: 'Style has been Added'
                        });   
              } 

              }).catch(function(error) {
                console.error("Error:", error);
              });
          }
          else{
             var alertPopup = $ionicPopup.alert({
                title: 'Style added failed',
                template: 'Please add Different Style'
              });
          }
         
           
      
      }


  
   $scope.saveSetting = function(){

         if($scope.barberBooking.startTime != null && $scope.barberBooking.endTime != null){
         
              if(($scope.barberBooking.startTime == $scope.barberBooking.endTime) && ($scope.barberBooking.startTimeAMPM ==  $scope.barberBooking.endTimeAMPM )){
              var alertPopup = $ionicPopup.alert({
                          title: 'Time Schedule Error',
                          template: 'Incorrect Time , kindly select different time give in note'
                        });   
              }
                      
              else if($scope.barberBooking.startTime < 9 && $scope.barberBooking.startTimeAMPM ==  'AM'){
                    var alertPopup = $ionicPopup.alert({
                          title: 'Time Schedule Error',
                          template: 'Incorrect Time , kindly select different time give in note'
                        });   
                  }   
              
              else if($scope.barberBooking.startTime > 9 && $scope.barberBooking.startTimeAMPM ==  'PM'){
                    var alertPopup = $ionicPopup.alert({
                          title: 'Time Schedule Error',
                          template: 'Incorrect Time , kindly select different time give in note'
                        });   
                  }
          
                  
                else if($scope.barberBooking.endTime > 6 && $scope.barberBooking.endTimeAMPM ==  'PM'){
                    var alertPopup = $ionicPopup.alert({
                          title: 'Time Schedule Error',
                          template: 'Incorrect Time , kindly select different time give in note'
                        });   
                  }
                  
                else if($scope.barberBooking.endTime < 6 && $scope.barberBooking.endTimeAMPM ==  'AM'){
                      var alertPopup = $ionicPopup.alert({
                            title: 'Time Schedule Error',
                            template: 'Incorrect Time , kindly select different time give in note'
                          });   
                    }                
              
              else{
                console.log(true);
                var barberRef = firebase.database().ref().child("barber").child(barberId).child('setTimeBooking');
                var arrTimes = [];
                var id = 0 ;
                              while ($scope.barberBooking.startTime > $scope.barberBooking.endTime && $scope.barberBooking.startTimeAMPM != $scope.barberBooking.endTimeAMPM) {
                              
                                  if($scope.barberBooking.startTime == 12 && $scope.barberBooking.startTimeAMPM == 'AM'){
                                              $scope.barberBooking.startTime = 12;
                                              $scope.barberBooking.startTimeAMPM = 'PM';
                                              
                                              arrTimes.push({availableTimes : $scope.barberBooking.startTime +" : 00 " + $scope.barberBooking.startTimeAMPM,
                                                                                                    isAvailable : true,
                                                                                                    isBooked : false,
                                                                                                    id : id               
                                                                                                    });                                               
                                                       $scope.barberBooking.startTime = 1;
                                                       id++;
                                              
                                            while ($scope.barberBooking.startTime < $scope.barberBooking.endTime){
                                                 arrTimes.push({availableTimes : $scope.barberBooking.startTime +" : 00 " + $scope.barberBooking.startTimeAMPM,
                                                      isAvailable : true,
                                                      isBooked : false ,
                                                      id : id                    
                                                      });     
                                                $scope.barberBooking.startTime++;
                                                id++;
                                              } 
                                          
                                        }
                                        
                                        arrTimes.push({availableTimes : $scope.barberBooking.startTime +" : 00 " + $scope.barberBooking.startTimeAMPM,
                                                      isAvailable : true,
                                                      isBooked : false,
                                                      id : id                    
                                                      });    
                                                      
                                          $scope.barberBooking.startTime++;
                                          id++;
                                          
                                }
                                
                                 while ($scope.barberBooking.startTime <= $scope.barberBooking.endTime){
                                                 arrTimes.push({availableTimes : $scope.barberBooking.startTime +" : 00 " + $scope.barberBooking.startTimeAMPM,
                                                      isAvailable : true,
                                                      isBooked : false,
                                                      id : id                    
                                                      });     
                                                $scope.barberBooking.startTime++;
                                                id++;
                                              } 
                                            
                     barberRef.set(arrTimes);
                     id = 0;
                    var alertPopup = $ionicPopup.alert({
                      title: 'Time Schedule Updated',
                      template: 'Time Schedule  has been updated'
                    });   
                    $scope.barberBooking = {
                      "startTime" : 9,
                      "endTime" : 6,
                      "startTimeAMPM" : "AM",
                      "endTimeAMPM" : "PM"
                    };  
                    $state.go("app.dashboard", {'id' : $rootScope.userProfile.userID });
  
                        
            
         
          }
      }
         else{
                  var alertPopup = $ionicPopup.alert({
                    title: 'Date Updated Failed',
                    template: 'Please Select Start Date and also End date'
                  });
         }
    
           
    }
    
 $scope.removeStyle = function (style){
           $scope.style = {};
           $scope.style.message = "";
           var barberRef = firebase.database().ref().child("barber").child(barberId).child('cuttingStyle');
           var barberArray = $firebaseArray(barberRef);
           var matchFound = false;
           barberArray.$loaded().then(function(success) {
            for(var i = 0 ; i < success.length ; i++){
                    if(success[i].styleName == style.styleName.toLowerCase()){
                        matchFound = true;
                         var confirmPopup = $ionicPopup.confirm({
                            title: 'Style Removed?',
                            template: 'Are you sure you want to remove this Style?'
                          });
                          confirmPopup.then(function(res) {
                            if(res) {
                              barberArray.$remove(success[i]);
                              $scope.style.message = "Removed Successfully";
                            }
                          });              
                        break;
                    }
              }
              if(matchFound === false){
                       $scope.style.message = "Removed Failed";  
                      var alertPopup = $ionicPopup.alert({
                        title: 'Style removed Failed',
                        template: 'Style has not been removed'
                      });   
              } 

              }).catch(function(error) {
                console.error("Error:", error);
              });
              $timeout(function() {
                $scope.style.message = "";
              },2000)
  }

 $ionicModal.fromTemplateUrl('./templates/styleList.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.viewStyleList = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

});