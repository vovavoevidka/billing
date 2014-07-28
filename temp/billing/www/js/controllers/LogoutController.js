var app = window.app_controllers;
app.controller('LogoutCtrl', function($scope, AuthenticationService) {
    AuthenticationService.logout();
});