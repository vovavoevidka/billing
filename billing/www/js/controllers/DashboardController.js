(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('DashCtrl', function($rootScope, $http, $scope, $ionicModal) {
        $scope.message = "";
        $scope.user = {}

        $http.get('http://192.168.254.13:3000/dashInfo')
            .success(function(data, status, headers, config) {
                $scope.user = data.user;
            })
            .error(function(data, status, headers, config) {
                $scope.message = "Error occured (";
                console.log("Error occurred.  Status:" + status);
            });
        //$rootScope.$broadcast('event:auth-loginRequired', {});
    });
}(window, document));