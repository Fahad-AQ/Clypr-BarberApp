ionicApp.controller('AppCtrl', function($scope,$rootScope,$state,authService,UserService,$timeout ) {
 $scope.userProfile = UserService.getUser();  
 $scope.goHome = function(id) {
          //Going to Search Barber
              $state.go('app.dashboard' , {'id' : id});
          }
$scope.doLogOut = function(user) {
            authService.logout();
            $scope.barberLogin = false;
            //Remove localStorage
            $rootScope.userRef = {};
            window.localStorage.removeItem('starter_user');
            $scope.objectBarber = {};
            $state.go('home');
};

});
