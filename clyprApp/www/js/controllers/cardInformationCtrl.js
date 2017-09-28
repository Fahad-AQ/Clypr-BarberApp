ionicApp.controller('cardInformationCtrl', function($scope,$rootScope,$state,$stateParams,$firebaseObject,$ionicPopup,UserService,$firebaseArray,$ionicModal,$timeout) {
      var userId = $stateParams.userId;
      $scope.userProfile = UserService.getUser(); 
      var userRef = firebase.database().ref().child("users").child(userId);
      $scope.userObject = $firebaseObject(userRef);
      $scope.userCard = $scope.userObject.cardInformation;
      var user2Ref = firebase.database().ref().child("users");
      var userArray = $firebaseArray(user2Ref);
      var matchFound = false;
      userArray.$loaded().then(function(success) {
      success.forEach(function(element) {
          if(element.userID == userId){
                if(element.cardInformation){
                          $scope.card = {
                              cardNumber : element.cardInformation.cardNumber,
                              expMonth : element.cardInformation.expMonth,
                              expYear :  element.cardInformation.expYear
                          };
                      
                      }
                      else{
                            $scope.card = {
                              cardNumber : 4242424242424242,
                              expMonth : 12,
                              expYear :  2018
                          };
                      }
          }
      }, this);
      
      }) 
      $scope.addedCardInformation = function (card){
            if($scope.card.cardNumber != '' && $scope.card.cardNumber != 4242424242424242 && $scope.card.cardNumber.toString().length == 16  && $scope.card.expMonth.toString().length == 2 && $scope.card.expYear.toString().length == 4){
           var userRef = firebase.database().ref().child("users");
           var userArray = $firebaseArray(userRef);
           var matchFound = false;
           userArray.$loaded().then(function(success) {
            for(var i = 0 ; i < success.length ; i++){
                    if(success[i].userID == userId && success[i].cardInformation.cardNumber == card.cardNumber && success[i].cardInformation.expMonth == card.expMonth && success[i].cardInformation.expYear == card.expYear){
                        matchFound = true;
                        var alertPopup = $ionicPopup.alert({
                          title: 'Card Information',
                          template: 'Card Information already has been Added'
                        });     
                        break;
                    }
              }
              if(matchFound === false){
                  var userRef2 = firebase.database().ref().child("users");
                      userRef2.child(userId).child('cardInformation').set(
                        {
                          cardNumber : card.cardNumber,
                          expMonth : card.expMonth,
                          expYear : card.expYear
                        }           
                      )
                        var alertPopup = $ionicPopup.alert({
                          title: 'Card Information Added',
                          template: 'Card Information has been Added'
                        });   
                         $state.go('app.editUserProfile' , { 
                                                              userId   : $scope.userProfile.userID,
                                                            });
              } 

              }).catch(function(error) {
                console.error("Error:", error);
              });
          }
          else{
             var alertPopup = $ionicPopup.alert({
                title: 'Card Information',
                template: 'Please add Different Card information'
              });
          }
         
           
      
      }


  
   
});