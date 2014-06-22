angular.module('starter.controllers', ['ionic'])

.controller('DashCtrl', function($rootScope, $scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/login.html', function(modal) {
        $scope.loginModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });
    //Be sure to cleanup the modal by removing it from the DOM
    $scope.$on('$destroy', function() {
        $scope.loginModal.remove();
    });
    //$scope.$emit("event:auth-loginRequired", {});
    //$rootScope.$broadcast('event:auth-loginRequired', {});
})

.controller('FriendsCtrl', function($scope, $http, Friends) {
    $scope.friends = Friends.all()
    $http.get('https://billing_list')
        .success(function(data, status, headers, config) {
            $scope.customers = data;
        })
        .error(function(data, status, headers, config) {
            console.log("Error occurred.  Status:" + status);
        });
})

.controller('FriendDetailCtrl', function($scope, $stateParams) {
    /*$scope.friend = Friends.get($stateParams.friendId);*/
})

.controller('AccountCtrl', function($scope) {})

.controller('LogoutCtrl', function($scope, AuthenticationService) {
    AuthenticationService.logout();
})

.controller('LoginCtrl', function($rootScope, $scope, $http, $state, AuthenticationService) {
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