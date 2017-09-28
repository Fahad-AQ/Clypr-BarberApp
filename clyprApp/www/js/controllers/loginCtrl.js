ionicApp.controller('loginCtrl', function($scope,$rootScope,$stateParams,$q,$ionicLoading,$state,$firebaseAuth,authService,$cordovaOauth,$ionicPopup,UserService,$firebaseArray) {
// coustomer login object
$scope.loginData = {
  email : "",
  password:""
}

$scope.doLogin = function(user) {
        if($scope.loginData.email && $scope.loginData.password){
              $ionicLoading.show({
                  template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                });
        }
  
      var coustomerRef = firebase.database().ref().child("users");
      var coustomerArray = $firebaseArray(coustomerRef);
      var matchFound = false;
      coustomerArray.$loaded().then(function(success) {
            for(var i = 0 ; i < success.length ; i++){
                 if(success[i].email == user.email){
                   matchFound = true;
                  // firebase auth service
                  var firebaseAuthObject = $firebaseAuth();
                        //firebase create user function with Email and password
                  firebaseAuthObject.$signInWithEmailAndPassword(user.email, user.password)
                          .then(function(success){
                          $ionicLoading.hide();
                          // set field null
                          $scope.loginData = {
                              email : "",
                              password:""
                              }
                      //save user in localStorage
                          UserService.setUser({
                          userID: success.uid,
                          name: success.name,
                          email: success.email,
                          picture: success.photoURL
                          });
                          $ionicLoading.hide();
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
                              template: 'Login failed user not found'
                          }); 
                          
                  } 

          });

};


// facebook login function
$scope.facebookSignIn = function() {
console.log("facebook clicked");  
//facebook Cordova plugins O-auth
 $cordovaOauth.facebook("240037596452903", ["email"]).then(function(result) {
    // facebook accessToken 
    var facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(result.access_token);
          //  firebase sign with access_token 
  firebase.auth().signInWithCredential(facebookCredential)
    .then(function(success) {
      console.log("Firebase success: " + JSON.stringify(success));
      var usersRef = firebase.database().ref();
  //  firebase save users
        usersRef.child("users").child(result.uid).set({
          userID: result.userId,
          name: result.displayName,
          email: result.email,
          picture: result.imageUrl,
          accessToken: result.accessToken,
          idToken: result.idToken
                  });
      //  save user in Local Storage
      UserService.setUser({
          userID: result.userId,
          name: result.displayName,
          email: result.email,
          picture: result.imageUrl,
          accessToken: result.accessToken,
          idToken: result.idToken
        });      
         $state.go("app.dashboard", { 'id' : result.uid });

  },function(error) {
    // Hide Ionic Loading while getting an error
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed',
            template: error
          });  
});
    
}, function(error) {
        // Hide Ionic Loading while getting an error
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed',
          template: error
        });  
    });
 
  };
// googlePlus login function
$scope.googlePlusLogin = function() {
  if(window.cordova){
    //GooglePlus Native App
        window.plugins.googleplus.login(
            {
              scopes: 'profile', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
              'webClientId': '271384142793-a6cvch8tnnev78efl4hf8clkrdbparvr.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
              'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
              },
            function(obj) {
          // google accessToken 
            var googleCredential = firebase.auth.GoogleAuthProvider
              .credential(obj.idToken); 
              firebase.auth().signInWithCredential(googleCredential)
                .then(function(success) {
                  console.log("Firebase success: " + JSON.stringify(success));
                    //  firebase save users
                  var usersRef = firebase.database().ref();
                  usersRef.child("users").child(success.uid).set({
                  userID: obj.userId,
                  name: obj.displayName,
                  email: obj.email,
                  picture: obj.imageUrl,
                  accessToken: obj.accessToken,
                  idToken: obj.idToken
                      });
                    //   save user in localStorage
                  UserService.setUser({
                  userID: obj.userId,
                  name: obj.displayName,
                  email: obj.email,
                  picture: obj.imageUrl,
                  accessToken: obj.accessToken,
                  idToken: obj.idToken
                  });
                    $ionicLoading.hide();
                    $state.go("app.dashboard", { 'id' : success.uid });
                },function(error) {
                  // Hide Ionic Loading while getting an error
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                      title: 'Login failed',
                      template: error
                    });  
                });
              },
                  function(msg) {
                      // Hide Ionic Loading while getting an error
                      $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                          title: 'Login failed',
                          template: error
                        });  
                      }
          ); 
       }
    else{
            var alertPopup = $ionicPopup.alert({
                    title: 'GoogleLogin failed',
                    template: "Can not authenticated Via Browser"
                  });  
    }
  }
});