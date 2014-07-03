(function(window, document) {
    'use strict';
    window.app = angular.module('starter', ['ionic', 'http-auth-interceptor']);
    var app = window.app;
    app.value('API_URL', "http://192.168.254.13:3000");
    app.config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

    app.run(function($rootScope, $ionicPlatform, $httpBackend, $http) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });
    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: "AppCtrl"
            })
            .state('app.dash', {
                url: '/dash',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('app.trafic', {
                url: '/trafic',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/trafic.html'
                        //controller: 'TraficCtrl'
                    }
                }
            })
            .state('app.paymentHistory', {
                url: '/paymentHistory',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/payments.html',
                        controller: 'PaymentsCtrl'
                    }
                }
            })
            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings-menu.html'
                    }
                }
            })
            .state('app.accountsettings', {
                url: '/accountsettings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/accountSettings.html',
                        controller: 'AccountSettingsCtrl'
                    }
                }
            })
            .state('app.applicationsettings', {
                url: '/applicationsettings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/applicationSettings.html',
                        controller: 'ApplicationSettingsCtrl'
                    }
                }
            })
        /*.state('app.settings', {
                url: '/settings',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings.html'
                    }
                }
            })*/
        /*.state('tab.friend-detail', {
                url: '/friend/:friendId',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/friend-detail.html',
                        controller: 'FriendDetailCtrl'
                    }
                }
            })
            */
        $urlRouterProvider.otherwise('/app/dash');
    });
}(window, document));