ionicApp.controller('searchCtrl', function($scope,$rootScope, $state,$stateParams,$firebaseArray,$ionicLoading) {
      //get all barbers
      $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });
      var barberRef = firebase.database().ref().child("barber");
      $scope.barberList = $firebaseArray(barberRef);
      $scope.barberList.$loaded().then(function(success) {
        $ionicLoading.hide();
      })
     })
