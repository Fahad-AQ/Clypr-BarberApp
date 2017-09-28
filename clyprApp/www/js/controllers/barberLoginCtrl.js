ionicApp.controller('barberLoginCtrl', function($scope, $stateParams,$firebaseAuth,$firebaseObject,$firebaseArray,$rootScope,$state,$ionicLoading,$ionicPopup,UserService,$firebaseObject ,authService ) {
// barber login object

$scope.loginBarbar={
  email :"",
  password : ""
}


//barber login function 

$scope.doBarbarLogin = function(user) {

      if($scope.loginBarbar.email && $scope.loginBarbar.password){
      //if barber object not null
          $ionicLoading.show({
              template: '<p>Loading...</p><ion-spinner></ion-spinner>'
            });
      }
  
      var barberRef = firebase.database().ref().child("barber");
      var barberArray = $firebaseArray(barberRef);
      var matchFound = false;
      barberArray.$loaded().then(function(success) {
            for(var i = 0 ; i < success.length ; i++){
                    if(success[i].email == user.email){
                         matchFound = true;
                                                    // firebase auth service
                          var firebaseAuthObject = $firebaseAuth();
                          //firebase sign in function Email and password
                          firebaseAuthObject.$signInWithEmailAndPassword(user.email, user.password)
                          .then(function(success){
                            // save user in local storage
      
                          $ionicLoading.hide();
                            //set field null
                          $scope.loginBarbar={
                              email :"",
                              password : ""
                          }
                          UserService.setUser({
                          userID: success.uid,
                          name: success.name,
                          email: success.email,
                          type: "barber",
                          picture: success.photoURL,
                          });
                          $state.go("app.dashboard", { 'id' : success.uid });     
           
                          },function(error){
                          $ionicLoading.hide();
                          var alertPopup = $ionicPopup.alert({
                              title: 'Login failed',
                              template: error
                          });  
                       })  
                        break;
                       }
                    }
              
                  if(matchFound === false){
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                              title: 'Login failed',
                              template: 'Login failed barber not found'
                          }); 
                          
                  } 

          });

};

});