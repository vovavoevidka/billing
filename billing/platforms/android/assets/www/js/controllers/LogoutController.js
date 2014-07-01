(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('LogoutCtrl', function($scope, AuthenticationService) {
        AuthenticationService.logout();
    });
}(window, document));