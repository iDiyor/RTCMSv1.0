'use strict'

/* User access controllers - Login */

var userAccessControllers = angular.module('userAccessControllers', ['userAccessServices', 'adminServices']);

userAccessControllers.controller('UserAccessCtrl', ['$scope', '$location', '$localStorage', 'UserAuthenticateService', 'AdminService', function ($scope, $location, $localStorage, UserAuthenticateService, AdminService) {
        
        // clear the locatstorage
        $localStorage.$reset();    

        $scope.onSubmitButtonClicked = function () {
            
            var username = $('#username').val();
            var password = $('#password').val();
            var role = 'admin';
            
            UserAuthenticateService.Authenticate(username, password, role ,function (res) {
                // need to pass res to app page
                if (res.responseStatus == 'success') {
                    if ($localStorage.adminProfile) {
                        $location.path('/app');
                    } else {
                        $localStorage.$default({
                            adminProfile: res.responseBody
                        });
                        $location.path('/app');
                    }
                    
                } else {
                    alert('Invalid username or password');
                }
            });  
        };
}]);