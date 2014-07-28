(function(window, document) {
    'use strict';
    var app = window.app;

    app.controller('AccountSettingsCtrl', function($scope, $state, $http, $ionicPopup, API_URL) {
    	$scope.data = {};
    	$scope.changePassword = function(valid){
    		if($scope.data.password == $scope.data.confirm_password && valid) {
	    		$http.post(API_URL.value + "/changePassword", {
	    			password: $scope.data.password
	    		}).success(function(){
	    			var popUp = $ionicPopup.alert({
						title: 'Password changed successfull!',
						template: 'After click you will be redirected to login with new password'
					});
					popUp.then(function(res) {
				    	$state.go('app.dash',{}, {
                        	location: 'replace'
                    	});
				   	});
	    		}).error(function(err){
	    			$ionicPopup.alert({
						title: 'Password changed error!',
						template: 'ERROR: ' + err
					});
	    		});
    		}
    	};
    });
}(window, document));