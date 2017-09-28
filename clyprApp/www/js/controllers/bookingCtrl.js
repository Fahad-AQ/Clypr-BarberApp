ionicApp.controller('bookingCtrl', function($scope,$state,$rootScope,UserService ,$stateParams,$firebaseObject,$firebaseArray,$ionicModal,ionicDatePicker,IonicDatepickerService,$ionicPopup) {     
        var barberId = $stateParams.barberId
        var barberRef = firebase.database().ref().child("barber").child(barberId);
        var barberArray = $firebaseArray(barberRef);
        $scope.userProfile = UserService.getUser();
        $scope.barberStylePrice = "Please Select Style";
        $scope.userHairCutting = {
           style :"Kindly select Style",
            selectedDate : new Date()
          };
        $scope.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $scope.convertDate = function(formatDate) {
        if(formatDate == null || isNaN(formatDate)){
         today = "";
         return today;
        }
        var today = new Date(formatDate);
        var dd = today.getDate();
        var mm = $scope.monthsList[today.getMonth()]; //January is 0!
        var yyyy = today.getFullYear();
        today = mm+'/'+dd+'/'+yyyy;
        return today;
      }

      $scope.changeStylePrice = function (style){

           var barberRef = firebase.database().ref().child("barber").child(barberId).child('cuttingStyle');
           var barberArray = $firebaseArray(barberRef);
           var matchFound = false;
           barberArray.$loaded().then(function(success) {

            for(var i = 0 ; i < success.length ; i++){
                    if(success[i].styleName == style.toLowerCase()){
                        matchFound = true;
                        return $scope.convertPrice(success[i].stylePrice);
                        break;
                    }
              }
              if(matchFound === false){
                       return $scope.convertPrice("");
              } 

              }).catch(function(error) {
                console.error("Error:", error);
              });
    
      
      }


       $scope.convertPrice = function(stylePrice) {
          if(stylePrice != null){ 
           $scope.barberStylePrice = stylePrice;
          }
          else {
           $scope.barberStylePrice ="Please Select Style";
          }    
        }

      $scope.userStyleRef = {};
      $scope.barberObject = $firebaseObject(barberRef);
      console.log($scope.barberObject)
      $scope.userId = $stateParams.userId;
      $scope.barberUid = $stateParams.barberId;
      $scope.barberDateTimes = {};
      $scope.cuttingStyle = "";
      
      $scope.selectedUser = {
       availableTime : ""
      };
      
      var userId = $stateParams.userId;
      var barberBookedRef = firebase.database().ref().child("Booking");
      $scope.barberBookedArray = $firebaseArray(barberBookedRef);
      $scope.barberBookedArray.$loaded().then(function(success) { 
      $scope.barberBookedArray = success;
      });
      $scope.getTimeFunction = function(date,time){
        var matchFound = false;
          for (var i = 0; i < $scope.barberBookedArray.length; i++) {
          if($scope.barberBookedArray[i].selectedDate == date && $scope.barberBookedArray[i].availableTime == time && $scope.barberBookedArray[i].appointment == "isNotDone"){
                  matchFound = true;
                  return true;
                  break;
                }

          }
          if(matchFound === false){
             return false;
          }
    
      }
      $scope.tip = "";
      $scope.barberBooking = {};
  
      $scope.addBooking = function(seletedTime,tip) {
        $scope.barberBooking.style = $scope.userHairCutting.style;
        $scope.barberBooking.selectedDate = $scope.userHairCutting.selectedDate;
        $scope.barberBooking.time = seletedTime;
        
                if( $scope.barberBooking.style != "Kindly select Style" && $scope.barberBooking.selectedDate != "Please Select a date" && $scope.barberBooking.time !="" ){
                        $scope.userProfile = UserService.getUser();  
                        var presentDate=new Date().getDate();              
                        var pastDate=new Date($scope.userHairCutting.selectedDate).getDate(); 
                      if(pastDate < presentDate){
                        console.log(presentDate)
                        console.log(pastDate)
                      var alertPopup = $ionicPopup.alert({
                                title: 'Booking Failed',
                                template: 'You Selected a past Date , Kindly Select Present and Future Date'
                        }); 
                      }
                      else {
                        $scope.barberBookedArray.$loaded().then(function(success) { 
                                  
                            if(success == null) {
                                console.log(success)
                            }
                              var matchFound = false;
                              for (var i = 0; i < success.length; i++) {
                                    if(success[i].userId == $scope.userProfile.userID && success[i].appointment == 'isNotDone' ){
                                              matchFound = true;
                                              var today = new Date();
                                              var dd = today.getDate();
                                              var mm = $scope.monthsList[today.getMonth()]; //January is 0!
                                              var yyyy = today.getFullYear();
                                              today = mm+'/'+dd+'/'+yyyy;
                                              var confirmPopup = $ionicPopup.confirm({
                                                  title: 'Change Date For booking',
                                                  template: 'Do you want to change this date?'
                                                });

                                                confirmPopup.then(function(res) {
                                                  if(res) {
                                                        var matchFound = false;
                                                        for (var i = 0; i < $scope.barberBookedArray.length; i++) {
                                                        if($scope.barberBookedArray[i].appointment == 'isNotDone' && $scope.barberBookedArray[i].changeDateCount == 0 ){
                                                          matchFound = true;
                                                          $scope.barberBookedArray[i].changeDateCount = 1;
                                                          $scope.barberBookedArray[i].currentDate = today;
                                                          $scope.barberBookedArray[i].selectedDate = $scope.barberBooking.selectedDate;
                                                          $scope.barberBookedArray[i].availableTime = $scope.barberBooking.time;
                                                          $scope.barberBookedArray.$save($scope.barberBookedArray[i]);
                                                          var alertPopup = $ionicPopup.alert({
                                                              title: 'Change Date For booking',
                                                              template: 'booking date has been changed'
                                                            });
                                                            break;
                                                      }
                                                      else if($scope.barberBookedArray[i].appointment == 'isNotDone' && $scope.barberBookedArray[i].changeDateCount == 1 ){
                                                           matchFound = true;
                                                           var alertPopup = $ionicPopup.alert({
                                                              title: 'Second Change Date For booking',
                                                              template: 'it will charge 5 dollar'
                                                            });
                                                           $state.go('app.changeDateCharge' , { 
                                                              barberId   : barberId,
                                                              userId   : $scope.userProfile.userID,
                                                              date   : $scope.barberBooking.selectedDate,
                                                              time   : $scope.barberBooking.time
                                                            });
                                                         
                                                            break;
                                                        }
                                                        
                                                    }
                                                    if(matchFound === false){
                                                    console.log('You are not sure');
                                                    }
                                                  } 
                                                  
                                                  else {
                                                    console.log('You are not sure');
                                                  }
                                                });
       
                                                    break;
                                              }
                                
                              }
                              if(matchFound === false){
                              console.log(true)
                              var today = new Date();
                              var dd = today.getDate();
                              var mm = $scope.monthsList[today.getMonth()]; //January is 0!
                              var yyyy = today.getFullYear();
                              today = mm+'/'+dd+'/'+yyyy;
                              var BookRef = firebase.database().ref();
                              $scope.userProfile = UserService.getUser(); 
                              $state.go('app.orderPlacement' , { 
                                      barberId   : barberId,
                                      userId   : $scope.userProfile.userID,
                                      date   : $scope.barberBooking.selectedDate,
                                      time   : $scope.barberBooking.time,
                                      style  : $scope.barberBooking.style,
                                      currentDate  : today,
                                      changeDateCount  : 0,
                                      tip  : tip
                                      });
                                $scope.userHairCutting = {
                                style :"Kindly select Style",
                                  selectedDate : new Date()
                                };
                              $scope.barberBooking = {};
                             }
                        })  
                    }
                          
                }
                else {
                      var alertPopup = $ionicPopup.alert({
                          title: 'booking Failed',
                          template: 'Kindly fill all field'
                        });  
                }
            
               
    };
      var userObject = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.userHairCutting.selectedDate = val;
        
      },
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,  
      disabledDates: [            //Optional
        new Date(2017, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ], 
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      yearsList: [2017, 2018, 2019, 2020,2021, 2022, 2023, 2024,2025, 2026, 2027, 2028],
      templateType: 'popup',
      from: "",
      to: "",
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(userObject);
    };
    $scope.checkBarberFunction = function (user) {
    
    if(user.type == 'barber'){
        console.log("this is barber")
    }
    else{
     $scope.openDatePicker();
     
    }
   
    }
    $scope.checkBarberFunction($scope.userProfile);
   
});