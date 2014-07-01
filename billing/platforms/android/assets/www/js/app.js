(function(window, document) {
    'use strict';
    window.app = angular.module('starter', ['ionic', 'http-auth-interceptor']); /*'ngMockE2E',*/
    var app = window.app;
    app.value('API_URL', "http://192.168.254.13:3000");
    app.config(function($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

    app.run(function($rootScope, $ionicPlatform, $httpBackend, $http) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });

        // Mocking code used for simulation purposes (using ngMockE2E module) 
        /*var authorized = false;
        var customers = [{
            name: 'John Smith'
        }, {
            name: 'Tim Johnson'
        }];*/

        // returns the current list of customers or a 401 depending on authorization flag
        /*$httpBackend.whenGET('https://billing_list').respond(function(method, url, data, headers) {
            return authorized ? [200, customers] : [401];
        });
        $httpBackend.whenPOST('https://login').respond(function(method, url, data) {
            authorized = true;
            return [200, {
                authorizationToken: "NjMwNjM4OTQtMjE0Mi00ZWYzLWEzMDQtYWYyMjkyMzNiOGIy"
            }];
        });
        $httpBackend.whenPOST('https://logout').respond(function(method, url, data) {
            authorized = false;
            return [200];
        });*/
        // All other http requests will pass through
        //$httpBackend.whenGET(/.*/).passThrough();
    });
    app.config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
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
        /*.state('tab.friend-detail', {
                url: '/friend/:friendId',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/friend-detail.html',
                        controller: 'FriendDetailCtrl'
                    }
                }
            })
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })*/
        $urlRouterProvider.otherwise('/app/dash');
    });
}(window, document));