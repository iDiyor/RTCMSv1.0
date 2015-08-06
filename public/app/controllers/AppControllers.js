'use strict'

/* App controllers */
var appControllers = angular.module('appControllers', ['adminServices']);

appControllers.controller('AppCtrl', ['$scope', '$location', '$localStorage', 'AdminService', function ($scope, $location, $localStorage, AdminService) {
        
        var adminProfile = $localStorage.adminProfile;
        
        if (adminProfile) {
            $scope.user = adminProfile.userProfile.first_name;
            $location.path('app/driver');
        } else {
            $scope.user = 'Guest';
        }
           
        

        $scope.onSignOutButtonClicked = function () {
            $localStorage.$reset();
            $location.path('/');
        };

}]);