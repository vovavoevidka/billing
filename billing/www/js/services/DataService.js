(function(window, document) {
    'use strict';
    var app = window.app;

    app.factory('DataService', function($rootScope, $http, API_URL) {
        var dashInfo = null;

        var getDash = function(success, error) {
            $http.get(API_URL + '/dashInfo')
                .success(function(data, status, headers, config) {
                    dashInfo = data.user;
                    success(dashInfo);
                })
                .error(function(data, status, headers, config) {
                    error(data);
                    //console.log("Error occurred.  Status:" + status);
                });
        };
        return {
            getDashInfo: function(success, error, force) {
                if (force) {
                    getDash(success, error);
                } else {
                    if (dashInfo)
                        success(dashInfo);
                    else
                        getDash(success, error);
                }
            }
        };
    })

}(window, document));