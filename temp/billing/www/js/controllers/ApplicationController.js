var app = window.app_controllers;
app.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $ionicSideMenuDelegate, AuthenticationService) {
    $ionicModal.fromTemplateUrl('templates/login.html', function(modal) {
        $scope.loginModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    });
    $scope.$on('$destroy', function() {
        $scope.loginModal.remove();
    });
    $rootScope.isAuthorized = AuthenticationService.isAuthorized;
    $rootScope.logout = AuthenticationService.logout;
});