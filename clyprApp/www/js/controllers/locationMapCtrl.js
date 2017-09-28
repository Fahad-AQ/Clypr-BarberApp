ionicApp.controller('locationMapCtrl', function($scope,$rootScope, $state,$stateParams,$firebaseArray,$ionicLoading,$ionicPopup) {
     $scope.location = {'from': '', 'fromLat': 24.8614622 , 'fromLng' : 67.0099388 }; 
     $scope.initialize = function () {
  
                var mapOptions = {
                  center: { lat: $scope.location.fromLat, lng:  $scope.location.fromLng },
                  zoom:16,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
              var map = new google.maps.Map(document.getElementById('map'), mapOptions);
              $scope.marker = new google.maps.Marker({
                    position: new google.maps.LatLng($scope.location.fromLat,$scope.location.fromLng ),
                    map: map,
                    title: 'Barber Location'
                }, function(err) {
                    console.err(err);
                });
        
          var inputFrom = document.getElementById('pac-input');
          var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
          google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
              var place = autocompleteFrom.getPlace();
              $scope.location.fromLat = place.geometry.location.lat();
              $scope.location.fromLng = place.geometry.location.lng();
              $scope.location.from = place.formatted_address;
              var mapOptions = {
                  center: { lat: $scope.location.fromLat, lng:  $scope.location.fromLng  },
                  zoom: 16,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
              var map = new google.maps.Map(document.getElementById('map'), mapOptions);
              $scope.marker = new google.maps.Marker({
                    position: new google.maps.LatLng($scope.location.fromLat, $scope.location.fromLng),
                    map: map,
                    title: 'Barber Location'
                }, function(err) {
                    console.err(err);
                });
 
          });
  
          
    }  
    
    $scope.disableTap = function() {
    var container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    var backdrop = document.getElementsByClassName('backdrop');
    angular.element(backdrop).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function() {
    document.getElementById('pac-input').blur();
    });
    };
    
    $scope.setLocation = function(){
    
         if($scope.location.fromLat != 24.8614622 && $scope.location.fromLng != 67.0099388){
          var barberId = $stateParams.barberId; 
          var mapOptions = {
                  center: { lat: $scope.location.fromLat, lng:  $scope.location.fromLng  },
                  zoom: 16,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
           var map = new google.maps.Map(document.getElementById('map'), mapOptions);
              $scope.marker = new google.maps.Marker({
                    position: new google.maps.LatLng($scope.location.fromLat, $scope.location.fromLng),
                    map: map,
                    title: 'Barber Location'
                }, function(err) {
                    console.err(err);
                });
            var barberRef = firebase.database().ref().child("barber").child(barberId).child('location');
            barberRef.set({ 
                fromLat: $scope.location.fromLat,
                fromLng: $scope.location.fromLng ,
                from:  $scope.location.from 
            });  
               var alertPopup = $ionicPopup.alert({
                          title: 'Location Setting',
                          template: 'Location has been Succesfully set'
                        }); 
         }

         else {
         }
           
           
    }
    
     
google.maps.event.addDomListener(window, "load", $scope.initialize());
     });
