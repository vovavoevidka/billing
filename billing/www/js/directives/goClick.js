(function(window, document) {
    'use strict';
    var app = window.app;

    app.directive('goClick', function($state) {
        return function(scope, element, attrs) {
            var path;

            attrs.$observe('goClick', function(val) {
                path = val;
            });

            element.bind('click', function() {
                scope.$apply(function() {
                    $state.go(path, {}, {
                        location: 'replace'
                    });
                });
            });
        };
    });

}(window, document));