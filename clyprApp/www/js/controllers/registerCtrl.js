ionicApp.controller('registerCtrl', function($scope, $rootScope ,$stateParams,$q,$ionicPopup,$state,$firebaseAuth,authService,$ionicLoading,UserService) {
            // coustomer register object
            $scope.registerData = {
            username : "",
            email : "",
            password : ""
            }; 

            $scope.coustomerRegister = function(user){
            // coustomer register object
            console.log("coustomRegister clicked"); 

            if($scope.registerData.username && $scope.registerData.email && $scope.registerData.password){
            //if coustomer object not null
            $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
            });
            }
            // firebase auth service
            var firebaseAuthObject = $firebaseAuth();
            //firebase sign in function Email and password
          firebaseAuthObject.$createUserWithEmailAndPassword(user.email, user.password)
          .then(function(success){
          console.log("Firebase success: " + JSON.stringify(success));
          //firebase reference
          var usersRef = firebase.database().ref();
          //firebase reference set users 
          usersRef.child("users").child(success.uid).set({
          userID: success.uid,
          name: $scope.registerData.username,
          email: success.email,
          picture: success.photoURL
            });
          // save user in localStorage
          UserService.setUser({
          userID: success.uid,
          name: $scope.registerData.username,
          email: success.email,
          picture: success.photoURL
          });
          $ionicLoading.hide();
          $scope.registerData = {
          username : "",
          email : "",
          password : ""
          };  
          $state.go("app.dashboard", { 'id' : success.uid });
          },function(error){
          // Hide Ionic Loading while getting an error
          $ionicLoading.hide();
});
}


});