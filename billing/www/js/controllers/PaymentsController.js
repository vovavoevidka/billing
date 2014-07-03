(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('PaymentsCtrl', function($scope, DataService) {
        $scope.payments = [];
        var nowFetched = 0
        $scope.isEnd = false;
        $scope.Math = window.Math;
        $scope.loadMore = function() {
            if (!$scope.isEnd)
                DataService.getPaymentsInfo(nowFetched, nowFetched + 20, function(data, isEnd) {
                    $scope.payments.push.apply($scope.payments, data);
                    nowFetched += 20;
                    $scope.isEnd = isEnd;
                }, function(error) {});
        };

        $scope.doRefresh = function() {
            DataService.getPaymentsInfo(-1, null, function(data, isEnd) {
                $scope.payments.unshift.apply($scope.payments, data);
                nowFetched += data.length;
                $scope.isEnd = isEnd;
            }, function(error) {});
        };

        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
    });
}(window, document));