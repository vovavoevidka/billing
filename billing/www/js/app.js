
window.app = angular.module('starter', ['ionic', 'http-auth-interceptor']);
var app = window.app;
var API_URL = window.localStorage['API_URL'] || "http://192.168.254.13:3000";
app.value('API_URL', {value: API_URL});
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
    /*$rootScope.menuButton = [
        {
            type: 'button-positive',
            content: '<i class="icon ion-navicon"></i>',
            tap: function(e) {
                $rootScope.toggleMenu();
            }
        }
    ];*/
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
        /*.state('app.applicationsettings', {
            url: '/settings/applicationsettings',
            views: {
                'menuContent': {
                    templateUrl: 'templates/applicationSettings.html',
                    controller: 'ApplicationSettingsCtrl'
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
        })*/
        
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
app.directive('uiValidate', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var validateFn, validators = {},
                validateExpr = scope.$eval(attrs.uiValidate);

            if (!validateExpr){ return;}

            if (angular.isString(validateExpr)) {
                validateExpr = { validator: validateExpr };
            }

            angular.forEach(validateExpr, function (exprssn, key) {
                validateFn = function (valueToValidate) {
                var expression = scope.$eval(exprssn, { '$value' : valueToValidate });
                if (angular.isObject(expression) && angular.isFunction(expression.then)) {
                    expression.then(function(){ 
                        ctrl.$setValidity(key, true);
                    }, function(){
                        ctrl.$setValidity(key, false);
                    });
                    return valueToValidate;
                } else if (expression) {
                    // expression is true
                    ctrl.$setValidity(key, true);
                    return valueToValidate;
                } else {
                    // expression is false
                    ctrl.$setValidity(key, false);
                    return valueToValidate;
                }
            };
            validators[key] = validateFn;
            ctrl.$formatters.push(validateFn);
            ctrl.$parsers.push(validateFn);
            });

            function apply_watch(watch)
            {
              //string - update all validators on expression change
                if (angular.isString(watch))
                {
                    scope.$watch(watch, function(){
                        angular.forEach(validators, function(validatorFn){
                            validatorFn(ctrl.$modelValue);
                        });
                    });
                    return;
                }

                //array - update all validators on change of any expression
                if (angular.isArray(watch))
                {
                    angular.forEach(watch, function(expression){
                        scope.$watch(expression, function()
                        {
                            angular.forEach(validators, function(validatorFn){
                                validatorFn(ctrl.$modelValue);
                            });
                        });
                    });
                    return;
                }

                //object - update appropriate validator
                if (angular.isObject(watch))
                {
                    angular.forEach(watch, function(expression, validatorKey)
                    {
                        //value is string - look after one expression
                        if (angular.isString(expression))
                        {
                            scope.$watch(expression, function(){
                                validators[validatorKey](ctrl.$modelValue);
                            });
                        }

                        //value is array - look after all expressions in array
                        if (angular.isArray(expression))
                        {
                            angular.forEach(expression, function(intExpression)
                            {
                                scope.$watch(intExpression, function(){
                                    validators[validatorKey](ctrl.$modelValue);
                                });
                            });
                        }
                    });
                }
            }
            // Support for ui-validate-watch
            if (attrs.uiValidateWatch){
                apply_watch( scope.$eval(attrs.uiValidateWatch) );
            }
        }
    };
});