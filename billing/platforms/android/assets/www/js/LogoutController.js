angular.module('starter.controllers', [])

.controller('LogoutCtrl', function($scope, AuthenticationService) {
    AuthenticationService.logout();
})