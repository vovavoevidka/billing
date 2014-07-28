(function(window, document) {
    'use strict';
    var app = window.app;

    app.factory('AuthenticationService', function($rootScope, $http, authService, $httpBackend, API_URL) {
        var service = {
            login: function(user) {
                $http.post(API_URL.value + '/login', {}, {
                    headers: {
                        username: user.username.toString(),
                        password: user.password.toString()
                    },
                    ignoreAuthModule: true
                })
                    .success(function(data, status, headers, config) {
                        $http.defaults.headers.common.Authorization = data.authorizationToken; // Step 1

                        // Need to inform the http-auth-interceptor that
                        // the user has logged in successfully.  To do this, we pass in a function that
                        // will configure the request headers with the authorization token so
                        // previously failed requests(aka with status == 401) will be resent with the
                        // authorization token placed in the header
                        authService.loginConfirmed(data, function(config) {
                            config.headers.Authorization = data.authorizationToken;
                            return config;
                        });
                    })
                    .error(function(data, status, headers, config) {
                        $rootScope.$broadcast('event:auth-login-failed', status);
                    });
            },
            logout: function(user) {
                $http.post(API_URL.value + '/logout', {}, {
                    ignoreAuthModule: true
                }).
                finally(function(data) {
                    delete $http.defaults.headers.common.Authorization;
                    $rootScope.$broadcast('event:auth-logout-complete');
                });
            },
            loginCancelled: function() {
                authService.loginCancelled();
            }
        };
        return service;
    })

}(window, document));