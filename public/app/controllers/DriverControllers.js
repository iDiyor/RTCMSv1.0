'use strict';

/* Controllers */

var driverControllers = angular.module('driverControllers', []);

// Admin tab
driverControllers.controller('DriverCtrl', ['$scope', 'Driver', 
    function ($scope, Driver) {
        $scope.drivers = Driver.query();
        
        $scope.title = 'Driver Tab';

        $scope.onButtonClick = function (mode) {
            console.log(mode + ' Button Clicked');
            
            
            if (mode == 'edit') {
                $('#editModalDialog').modal('show');
            }
            else if (mode == 'add') {
                $('#addModalDialog').modal('show');
            }

            
            console.log($scope.drivers);
        };

}]);