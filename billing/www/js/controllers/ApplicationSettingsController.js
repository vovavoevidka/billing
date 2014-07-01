(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('ApplicationSettingsCtrl', function($scope, API_URL) {
        $scope.apiUrl = angular.copy(API_URL);
        $scope.saveApiUrl = function() {
            API_URL = $scope.apiUrl;
        };
    });
}(window, document));