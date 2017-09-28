ionicApp.controller('reviewsCtrl', function($scope,$state,$rootScope,UserService ,$stateParams,$firebaseObject,$firebaseArray,$ionicModal,ionicDatePicker,IonicDatepickerService,$ionicPopup) {     
      var barberId = $stateParams.barberId
      var barberRef = firebase.database().ref().child("reviews")
      $scope.userProfile = UserService.getUser(); 
      $rootScope.reviewsList = $firebaseArray(barberRef);
      $rootScope.reviewsList.$loaded().then(function(success) {
      $scope.reviewsList = success;
      console.log($scope.reviewsList)
      })
      console.log($scope.reviewsList)
      $scope.barberUid = $stateParams.barberId;
      $scope.rating = {};
      $scope.rating.rate = 0;
      $scope.rating.max = 5;
      $scope.rating.commentUser = "";
      $scope.addReview = function(rating) {
        if(rating.rate && rating.commentUser){
            var barberBookedRef = firebase.database().ref().child("Booking");
            $scope.barberBookedArray = $firebaseArray(barberBookedRef);
            $scope.barberBookedArray.$loaded().then(function(success) {      
              if(success == null) {
                  console.log(success)
              }
                var matchFound = false;
                for (var i = 0; i < success.length; i++) {
                      if(success[i].userId == $scope.userProfile.userID && success[i].appointment == "isNotDone" ||success[i].userId == $scope.userProfile.userID && success[i].appointment == "done"  ){
                      matchFound = true;
                       barberRef.child(barberId).set({ "userId" : $scope.userProfile.userID,
                            "rate" : rating.rate, 
                            "name":  $rootScope.userRef.name,
                            "comment" :  rating.commentUser,
                            "date" :  firebase.database.ServerValue.TIMESTAMP
                        })
                        $scope.rating = {};
                        $scope.rating.rate = 0;
                        $scope.rating.max = 5;
                        $scope.rating.commentUser = "";
                             break;
                        }
                    }
                if(matchFound === false){  
                    var alertPopup = $ionicPopup.alert({
                        title: 'Review Added Failed',
                        template: "Kindly add booking first"
                        });  
                 }
               })
              
          }
          else { 
          }
    }
    
});