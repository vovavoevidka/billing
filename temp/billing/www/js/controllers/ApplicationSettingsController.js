var app = window.app_controllers;
app.controller('ApplicationSettingsCtrl', function($scope, API_URL) {
	window.localStorage['API_URL'] = API_URL.value;
    $scope.apiUrl = {value: angular.copy(API_URL.value)};
    $scope.saveApiUrl = function() {
        API_URL.value = $scope.apiUrl.value;
        window.localStorage['API_URL'] = API_URL.value;
    };
});