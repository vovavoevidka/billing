var app = window.app_controllers;
app.controller('LoginCtrl', function($rootScope, $scope, $http, $state, $ionicModal, AuthenticationService, $ionicSideMenuDelegate) {
    $scope.message = "";

    $scope.user = {
        username: null,
        password: null
    };
    $scope.rememberMe = {
        checked: false
    };

    $scope.login = function() {
        if($scope.rememberMe.checked) {
            window.localStorage['user'] = angular.toJson($scope.user);
        }
        AuthenticationService.login($scope.user);
    };

    $rootScope.$on('event:auth-loginRequired', function(e, rejection) {
        if(window.localStorage['user']) {
            AuthenticationService.login(angular.fromJson(window.localStorage['user']));
        } else {
            $scope.loginModal.show();
        }
    });

    $rootScope.$on('event:auth-loginConfirmed', function() {
        $scope.username = null;
        $scope.password = null;
        $scope.loginModal.hide();
        AuthenticationService.setAuthirized(true);
    });

    $rootScope.$on('event:auth-login-failed', function(e, status) {
        var error = "Login failed.";
        if (status == 401) {
            error = "Invalid Username or Password.";
        }
        $scope.message = error;
    });

    $rootScope.$on('event:auth-logout-complete', function() {
        $ionicSideMenuDelegate.toggleLeft();
        delete window.localStorage['user'];
        AuthenticationService.setAuthirized(false);
        $scope.loginModal.show();
    });
});