ionicApp.controller('editUserProfileCtrl', function($q,$scope,$state,$rootScope,UserService ,$stateParams,$firebaseObject,$firebaseArray,$ionicModal,ionicDatePicker,IonicDatepickerService,$ionicPopup,$cordovaImagePicker,$ionicPlatform,$timeout,$cordovaFile) {     
function saveToFirebase(_imageBlob, _filename) {

      return $q(function (resolve, reject) {
        // Create a root reference to the firebase storage
        var storageRef = firebase.storage().ref();

        // pass in the _filename, and save the _imageBlob
        var uploadTask = storageRef.child('images/' + _filename).put(_imageBlob);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
        }, function (error) {
          // Handle unsuccessful uploads, alert with error message
          alert(error.message)
          reject(error)
        }, function () {
          // Handle successful uploads on complete
          var downloadURL = uploadTask.snapshot.downloadURL;

          // when done, pass back information on the saved image
          resolve(uploadTask.snapshot)
        });
      });
    }


    function saveReferenceInDatabase(_snapshot) {
          var userProfileId = $scope.userProfile.userID;
          var userProfileRef = firebase.database().ref().child("users");
          $scope.userProfileArray = $firebaseArray(userProfileRef);   
          $scope.userProfileArray.$loaded().then(function(success) { 
              success.forEach(function(element) {
                    if(element.userID == userProfileId){
                        element.image = _snapshot.downloadURL;
                        return $scope.userProfileArray.$save(element).catch(function(_error){
                              alert("Error Saving to Assets " + _error.message);
                            })
                    }
                  }, this);
              }); 
    }
     
     
      var userId = $stateParams.userId
      var userRef = firebase.database().ref().child("users").child(userId);
      $scope.userProfile = UserService.getUser();  
      $scope.userObject = $firebaseObject(userRef);
     
      $scope.pickImage = function () {
      var options = {
        maximumImagesCount: 1, // only pick one image
        width: 800,
        height: 800,
        quality: 80
      };

      var fileName, path;

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          console.log('Image URI: ' + results[0]);

          // lets read the image into an array buffer..
          // see documentation:
          // http://ngcordova.com/docs/plugins/file/
          fileName = results[0].replace(/^.*[\\\/]/, '');

          // modify the image path when on Android
          if ($ionicPlatform.is("android")) {
            path = cordova.file.cacheDirectory
          } else {
            path = cordova.file.tempDirectory
          }

          return $cordovaFile.readAsArrayBuffer(path, fileName);
        }).then(function (success) {
          // success - get blob data
          var imageBlob = new Blob([success], { type: "image/jpeg" });

          // missed some params... NOW it is a promise!!
          return saveToFirebase(imageBlob, fileName);
        }).then(function (_responseSnapshot) {
          // we have the information on the image we saved, now 
          // let's save it in the realtime database
          return saveReferenceInDatabase(_responseSnapshot)
        }).then(function (_response) {
          alert("Saved Successfully!!")
        }, function (error) {
          // error
          console.log(error)
        });
    
      }
      
    
      

});