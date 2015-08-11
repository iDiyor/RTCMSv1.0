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
        
        
        var socket = io.connect('http://52.28.143.209:3000', { 'forceNew': true, 'reconnection': true });
        

        socket.on('connect', function () {
            var client = {
                name: 'jeb',
                type: 'web'
            };
            
            socket.emit('client:connection', client);
        });           
        
        
        $scope.socket = socket;
        


        $scope.$on('$destroy', function onAppControllerDestroy() {
            // say goodbye to your controller here
            // release resources, cancel request...
            console.log("AppController destroyed");

            var client = {
                name: 'jeb',
                type: 'web'
            };
            
            socket.emit('client:disconnect', client);
            
            socket.disconnect();
            
        })

}]);