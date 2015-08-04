'use strict'

/* User access controllers - Login */

var userAccessControllers = angular.module('userAccessControllers', ['userAccessServices', 'adminServices']);

userAccessControllers.controller('UserAccessCtrl', ['$scope', '$location', 'UserAuthenticateService', 'AdminService',function ($scope, $location, UserAuthenticateService, AdminService) {

        $scope.onSubmitButtonClicked = function () {
            
            var username = $('#username').val();
            var password = $('#password').val();
            var role = 'driver';
            
            UserAuthenticateService.Authenticate(username, password, role ,function (res) {
                // need to pass res to app page
                if (res.responseStatus == 'success') {
                    AdminService.SetProfile(res.responseBody);
                    $location.path('/app');
                } else {
                    alert('Invalid username or password');
                }
            });  
        };
}]);