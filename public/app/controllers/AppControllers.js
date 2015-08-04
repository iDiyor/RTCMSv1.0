'use strict'

/* App controllers */
var appControllers = angular.module('appControllers', ['adminServices']);

appControllers.controller('AppCtrl', ['$scope', '$location', 'AdminService', function ($scope, $location, AdminService) {

        $scope.viewTitle = 'App View';
        

        $location.path('app/driver');
        
        var adminProfile = AdminService.GetProfile();
        $scope.user = adminProfile.userProfile.first_name;

        

}]);