ionicApp.service("authService",function($firebaseAuth){
//auth services using get , save and logout user
var firebaseAuthObject = $firebaseAuth();

return {
getRedirectResult : firebaseAuthObject.$getRedirectResult,
getAuth : firebaseAuthObject.$getAuth,
logout : firebaseAuthObject.$signOut
}
});