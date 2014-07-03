(function(window, document) {
    'use strict';
    var app = window.app;

    app.factory('DataService', function($rootScope, $http, API_URL) {
        var dashInfo = null;
        var paymentsInfo = {
            payments: [],
            isEnd: false
        };

        var getDash = function(success, error) {
            $http.get(API_URL + '/dashInfo')
                .success(function(data, status, headers, config) {
                    dashInfo = data.user;
                    success(dashInfo);
                })
                .error(function(data, status, headers, config) {
                    error(data);
                    //console.log("Error occurred.  Status:" + status);
                });
        };

        var PaymentsInfo = function(from, count, success, error) {
            var fid = (paymentsInfo.payments.length) ? paymentsInfo.payments[0].id : null;
            $http.post(API_URL + '/payments', {
                'from': from,
                'length': count,
                'fid': fid
            }).success(function(data, status, headers, config) {
                if (from == -1) {
                    paymentsInfo.payments.unshift.apply(paymentsInfo.payments, data.payments);
                    success(paymentsInfo.payments.slice(0, data.payments.length), false);
                } else {
                    paymentsInfo.payments.push.apply(paymentsInfo.payments, data.payments);
                    paymentsInfo.isEnd = data.isEnd;
                    success(paymentsInfo.payments.slice(from, count), paymentsInfo.isEnd)
                }
            }).error(function(data, status, headers, config) {
                error(data);
            });
        };
        return {
            getDashInfo: function(success, error, force) {
                if (force) {
                    getDash(success, error);
                } else {
                    if (dashInfo)
                        success(dashInfo);
                    else
                        getDash(success, error);
                }
            },
            getPaymentsInfo: function(from, count, success, error) {
                if (from == -1) {
                    PaymentsInfo(from, count, success, error)
                }
                if (paymentsInfo && paymentsInfo.payments && paymentsInfo.payments[from] && paymentsInfo.payments[from + count]) {
                    success(paymentsInfo.payments.slice(from, count), paymentsInfo.isEnd)
                } else {
                    PaymentsInfo(from, count, success, error);
                }
            }
        };
    })

}(window, document));