(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('FriendsCtrl', function($scope, $http, Friends, API_URL) {
        $scope.friends = Friends.all();
        $http.get(API_URL + '/')
            .success(function(data, status, headers, config) {
                $scope.customers = data;
            })
            .error(function(data, status, headers, config) {
                console.log("Error occurred.  Status:" + status);
            });
    });
}(window, document));