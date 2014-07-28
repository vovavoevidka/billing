(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $ionicSideMenuDelegate) {

        $rootScope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $ionicModal.fromTemplateUrl('templates/login.html', function(modal) {
            $scope.loginModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        });
        //Be sure to cleanup the modal by removing it from the DOM
        $scope.$on('$destroy', function() {
            $scope.loginModal.remove();
        });



    });
}(window, document));