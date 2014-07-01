(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('LoginCtrl', function($rootScope, $scope, $http, $state, $ionicModal, AuthenticationService) {
        $scope.message = "";

        $scope.user = {
            username: null,
            password: null
        };

        $scope.login = function() {
            AuthenticationService.login($scope.user);
        };

        $rootScope.$on('event:auth-loginRequired', function(e, rejection) {
            $scope.loginModal.show();
        });

        $rootScope.$on('event:auth-loginConfirmed', function() {
            $scope.username = null;
            $scope.password = null;
            $scope.loginModal.hide();
        });

        $rootScope.$on('event:auth-login-failed', function(e, status) {
            var error = "Login failed.";
            if (status == 401) {
                error = "Invalid Username or Password.";
            }
            $scope.message = error;
        });

        $rootScope.$on('event:auth-logout-complete', function() {
            $state.go('tab.dash', {}, {
                reload: true,
                inherit: false
            });
        });
    });
}(window, document));