ionicApp.controller('barberProfileCtrl', function($scope,$state,$rootScope,UserService ,$stateParams,$firebaseObject,$firebaseArray,$ionicModal,ionicDatePicker,IonicDatepickerService,$ionicPopup) {     
      var barberId = $stateParams.barberId;
      var barbeReviewsRef = firebase.database().ref().child("reviews").child(barberId);
      $scope.userProfile = UserService.getUser();
      $scope.rating = {};
      $scope.rating.rate = 3;
      $scope.rating.max = 5;
      $rootScope.reviewsList = $firebaseArray(barbeReviewsRef);
      $rootScope.reviewsList.$loaded().then(function(success) {
        if($rootScope.reviewsList.length == 0){
          $scope.rating.rate = 0;
          $scope.rating.max = 5;
          console.log($rootScope.reviewsList)
          }
       })
      var barberRef = firebase.database().ref().child("barber").child(barberId);
      $scope.barberObject = $firebaseObject(barberRef);
      $scope.barberUid = $stateParams.barberId;
      $scope.barberObject.$loaded().then(function(success) {
      if(success.location){
      var mapOptions = {
        center: { lat: success.location.fromLat  , lng: success.location.fromLng  } ,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
            
      var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
      $scope.marker = new google.maps.Marker({
            position: new google.maps.LatLng( success.location.fromLat  , success.location.fromLng ),
            map: map,
            title: 'Barber Location'
        }, function(err) {
            console.err(err);
        });

      }

      })

   
});