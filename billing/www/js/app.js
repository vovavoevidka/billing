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
                        controller: 'DashCtrl',
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
            .state('app.settings', {
                url: '/settings',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings.html'
                    }
                }
            })
            .state('app.settings.menu', {
                url: '/menu',
                onEnter: function($state) {
                    debugger;
                },
                onExit: function($state) {
                    debugger;
                },
                views: {
                    'settings': {
                        templateUrl: 'templates/settings-menu.html'
                    }
                }
            })
            .state('app.settings.accountSettings', {
                url: '/accountSettings',
                onEnter: function($state) {
                    debugger;
                },
                views: {
                    'settings': {
                        templateUrl: 'templates/accountSettings.html',
                        controller: 'AccountSettingsCtrl'
                    }
                }
            })
            .state('app.settings.applicationSettings', {
                url: '/applicationSettings',
                views: {
                    'settings': {
                        templateUrl: 'templates/applicationSettings.html',
                        controller: 'ApplicationSettingsCtrl'
                    }
                }
            })
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