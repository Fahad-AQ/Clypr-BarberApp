
ionicApp.controller('tipChargeCtrl', function($scope,$state,$rootScope,UserService ,$stateParams,$firebaseObject,$firebaseArray,$ionicModal,ionicDatePicker,IonicDatepickerService,$ionicPopup,$http,stripe,CONFIG,$ionicLoading) {     
  $http.defaults.headers.common['Content-Type']   = 'application/x-www-form-urlencoded';
  $http.defaults.headers.common['Accept']         = 'application/json';
  
 Stripe.setPublishableKey(CONFIG.stripePublicKey);
 $scope.userProfile = UserService.getUser(); 
    var userBookedId = $stateParams.userId;
    var barberBookedId = $stateParams.barberId;
    var userBookedDate = $stateParams.date;
    var userBookedTip = $stateParams.tip;
  $scope.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var userId = $stateParams.userId;
  var userRef = firebase.database().ref().child("users");
  var userArray = $firebaseArray(userRef);
  var matchFound = false;
  userArray.$loaded().then(function(success) {
  success.forEach(function(element) {
      if(element.userID == userId){
        if(element.cardInformation){
                $scope.payment = {
                    amount : (parseInt(userBookedTip))*100, // 500/100 = 5 dollar
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
                amount : (parseInt(userBookedTip))*100, // 500/100 = 5 dollar
                    card : {
                    emp_month : 12,
                    exp_year : 2018,
                    number : '4242424242424242',
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
                  else{
                      
                        var userBookRef =  firebase.database().ref().child("Booking");
                        var userBookingArray = $firebaseArray(userBookRef);
                        userBookingArray.$loaded().then(function(success) {
                         var matchFound = false;
                        for(var i = 0 ; i < success.length ; i++){
                                if(success[i].userId == userBookedId && success[i].barberId == barberBookedId && success[i].appointment == "isNotDone"){
                                        matchFound = true;
                                        success[i].appointment = "done";  
                                        success[i].tip = (userBookedTip) ? parseInt(userBookedTip)*100+success[i].tip : parseInt(userBookedTip)*100;
                                        userBookingArray.$save(success[i]).then(function() {
                                                    $ionicLoading.hide();
                                                    var alertPopup = $ionicPopup.alert({
                                                        title: 'Tip Alert',
                                                        template: 'Tip successfully has been Transfer'
                                                    }); 
                                                    $state.go('app.dashboard' , {'id' :  $scope.userProfile.userID});  
                                                    });
                                         }
                                   }
                                   
                                   if(matchFound == false){
                                      console.log(userBookedDate);
                                   }
                               }) 
                         }
                        
                       })   
               
                  }
                  
              };
   

        
          }


}); 