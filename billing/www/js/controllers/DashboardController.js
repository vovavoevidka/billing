(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('DashCtrl', function($scope, DataService) {
        $scope.user = {}
        DataService.getDashInfo(function(data) {
            $scope.user = data;
        }, function(err) {

        });
        $scope.doRefresh = function() {
            DataService.getDashInfo(function(data) {
                $scope.user = data;
                $scope.$broadcast('scroll.refreshComplete');
            }, function(err) {

            }, true);
        };

    });
}(window, document));