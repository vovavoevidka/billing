(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('ApplicationSettingsCtrl', function($scope, API_URL) {
    	window.localStorage['API_URL'] = API_URL.value;
        $scope.apiUrl = angular.copy(API_URL.value);
        $scope.saveApiUrl = function() {
            API_URL.value = $scope.apiUrl;
            window.localStorage['API_URL'] = API_URL.value;
        };
    });
}(window, document));