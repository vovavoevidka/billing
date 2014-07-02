(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('DashCtrl', function($scope, DataService) {
        $scope.user = {}
        var plunButidy = function(str) {
            var str = str.replace(/-/g, " ");
            return str = str.substr(str.lastIndexOf("]") + 1);
        };
        DataService.getDashInfo(function(data) {
            data.pl_name = plunButidy(data.pl_name);
            $scope.user = data;
        }, function(err) {

        });
        $scope.doRefresh = function() {
            DataService.getDashInfo(function(data) {
                data.pl_name = plunButidy(data.pl_name);
                $scope.user = data;
                $scope.$broadcast('scroll.refreshComplete');
            }, function(err) {

            }, true);
        };

    });
}(window, document));