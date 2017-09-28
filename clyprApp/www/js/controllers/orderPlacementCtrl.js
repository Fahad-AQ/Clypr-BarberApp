
ionicApp.controller('orderPlacementCtrl', function($scope,$state,$rootScope,UserService ,$stateParams,$firebaseObject,$firebaseArray,$ionicModal,ionicDatePicker,IonicDatepickerService,$ionicPopup,$http,stripe,CONFIG,$ionicLoading) {     
  $http.defaults.headers.common['Content-Type']   = 'application/x-www-form-urlencoded';
  $http.defaults.headers.common['Accept']         = 'application/json';
  
 Stripe.setPublishableKey(CONFIG.stripePublicKey);
 $scope.userProfile = UserService.getUser(); 
  var userId = $stateParams.userId;
  var userTipAmount = $stateParams.tip;
  var userRef = firebase.database().ref().child("users");
  var userArray = $firebaseArray(userRef);
  var matchFound = false;
  userArray.$loaded().then(function(success) {
  success.forEach(function(element) {
      if(element.userID == userId){
        if(element.cardInformation){
                $scope.payment = {
                    amount : (userTipAmount) ? (parseInt(userTipAmount))*100+500 : 500, // 500/100 = 5 dollar
                    card : {
                    emp_month : element.cardInformation.expMonth,
                    exp_year : element.cardInformation.expYear,
                    number : element.cardInformation.cardNumber,
                    cvc : 999
                    }
                }
              }
              else{
                $scope.payment = {
                amount : (userTipAmount) ? (parseInt(userTipAmount))*100+500 : 500 , // 500/100 = 5 dollar
                    card : {
                    emp_month : 12,
                    exp_year : 2018,
                    number : 4242424242424242,
                    cvc : 999
                    }
                  }
              }
      }
  }, this);
  
  }) 
 $scope.stripeCallback = function (payment) {

  $ionicLoading.show({
              template: '<p>Loading...</p><ion-spinner></ion-spinner>'
            });
            Stripe.card.createToken({
                number: payment.card.number,
                cvc: payment.card.cvc,
                exp_month: payment.card.emp_month,
                exp_year: payment.card.exp_year
              }, stripeResponseHandler);
     

              function stripeResponseHandler(status, response) {

                if (response.error) {
                  console.log(response.error)
                   $ionicLoading.hide();
                                  var alertPopup = $ionicPopup.alert({
                                        title: 'Payment execution failed',
                                        template: 'Incorrect Card Information'
                                    }); 
                } else {
                  // response contains id and card, which contains additional card details
                  var token = response.id;
                  
                  $http.post('http://clypr.herokuapp.com/payment',{data :{
                  stripeToken : token,
                  userEmail :  $scope.userProfile.email,
                  styleAmount :  $scope.payment.amount
                  }})
                  
                  
                  .then(function(success){
                  if(success == 'Incorrect Card Information'){
                  $ionicLoading.hide();
                                  var alertPopup = $ionicPopup.alert({
                                        title: 'Payment execution failed',
                                        template: 'Incorrect Card Information'
                                    }); 
                  }
                var barberId = $stateParams.barberId
                var barberTempRef = firebase.database().ref().child("barber").child(barberId);
                $scope.barberTempObj = $firebaseObject(barberTempRef);
                $scope.barberTempObj.$loaded().then(function(success) {
                $scope.barberTempObj = success;
             

                  var BookRef = firebase.database().ref().child('Booking');
                  
                       BookRef.push({ 
                                barberId   : $stateParams.barberId,
                                barberEmail  : $scope.barberTempObj.email,
                                barberName  : $scope.barberTempObj.name,
                                userId   : $stateParams.userId,
                                selectedDate   : $stateParams.date,
                                availableTime   : $stateParams.time,
                                selectedStyle  : $stateParams.style,
                                currentDate   : $stateParams.currentDate,
                                changeDateCount  : $stateParams.changeDateCount,
                                bookingPayment : "Booking Payment Done",
                                appointment : "isNotDone",
                                userEmail : $scope.userProfile.email,
                                userName : $rootScope.userRef.name,
                                tip : (userTipAmount) ? (parseInt(userTipAmount))*100 : 0
                                })
                                .then(function() {
                                      $ionicLoading.hide();
                                      $state.go('app.currentAppointment' , {'userId' :  $scope.userProfile.userID});  
                                })
                       })   
                  }) 
                  }
                  
              };
   

        
          }


}); 