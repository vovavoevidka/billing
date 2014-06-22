(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('FriendsCtrl', function($scope, $http, Friends) {
        $scope.friends = Friends.all();
        $http.get('http://192.168.254.13:3000/')
            .success(function(data, status, headers, config) {
                $scope.customers = data;
            })
            .error(function(data, status, headers, config) {
                console.log("Error occurred.  Status:" + status);
            });
    });
}(window, document));