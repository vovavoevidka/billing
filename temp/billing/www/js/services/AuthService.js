var app = window.app_services;
app.factory('AuthenticationService', function($rootScope, $http, authService, $httpBackend, API_URL) {
    var authorized = {value: false};
    var service = {
        isAuthorized: function(){
            return authorized.value;
        },
        setAuthirized: function(value) {
            authorized.value = !!value;
        },
        login: function(user) {
            $http.post(API_URL.value + '/login', {}, {
                headers: {
                    username: user.username.toString(),
                    password: user.password.toString()
                },
                ignoreAuthModule: true
            })
                .success(function(data, status, headers, config) {
                    $http.defaults.headers.common.Authorization = data.authorizationToken;
                    authService.loginConfirmed(data, function(config) {
                        config.headers.Authorization = data.authorizationToken;
                        return config;
                    });
                })
                .error(function(data, status, headers, config) {
                    $rootScope.$broadcast('event:auth-login-failed', status);
                });
        },
        logout: function() {
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
});