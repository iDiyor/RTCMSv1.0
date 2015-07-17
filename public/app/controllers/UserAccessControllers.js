'use strict'

/* User access controllers - Login */

var userAccessControllers = angular.module('userAccessControllers', ['userAccessServices']);

userAccessControllers.controller('UserAccessCtrl', ['$scope', '$location', 'UserAuthenticateSrvc', function ($scope, $location, UserAuthenticateSrvc) {
        
        $scope.pageTitle = 'LoginPage';
        
        $scope.onSubmitButtonClicked = function () {
            
            var username = $('#username').val();
            var password = $('#password').val();
            
            UserAuthenticateSrvc.Authenticate(username, password, function (res) {
                // need to pass res to app page
                if (res.responseStatus == 'success') {
                    $location.path('/app');
                } else {
                    alert('Invalid username or password');
                }
            });  
        };
}]);