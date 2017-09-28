ionicApp.controller('barberRegisterCtrl', function($scope, $rootScope ,$stateParams,$q,$ionicPopup,$state,$firebaseAuth,authService,$ionicLoading,UserService) {
//barber register object
$scope.barberData = {
username : "",
email : "",
password : ""
}; 

// barber register function
$scope.barberRegister = function(user){
console.log("barberRegister clicked"); 

if($scope.barberData.username && $scope.barberData.email && $scope.barberData.password){
  //barber object not null
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });
}
// firebase auth service
var firebaseAuthObject = $firebaseAuth();
//firebase create user function with Email and password
firebaseAuthObject.$createUserWithEmailAndPassword(user.email, user.password)
.then(function(success){
      console.log("Firebase success: " + JSON.stringify(success));
          //firebase reference
          
          var usersRef = firebase.database().ref();
          //firebase reference set barber 
          usersRef.child("barber").child(success.uid).set({
          userID: success.uid,
          name: $scope.barberData.username,
          email: success.email,
          phone: $scope.barberData.phoneNumber,
          picture: success.photoURL,
          type: "barber"
                  });
          //save user in localStorage
          UserService.setUser({
          userID: success.uid,
          name: $scope.barberData.username,
          email: success.email,
          phone: $scope.barberData.phoneNumber,
          picture: success.photoURL,
          type: "barber"
        });
          $ionicLoading.hide();
          //set field null
          $scope.barberData = {
            username : "",
            email : "",
            password : ""
          };  

            $state.go("app.dashboard", { 'id' : success.uid });
    },function(error){
    // Hide Ionic Loading while getting an error
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
          title: 'barber Register failed',
          template: error
        });  
});
}


});