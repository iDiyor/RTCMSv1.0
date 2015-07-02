'use strict'

/* Controllers */

var vehicleControllers = angular.module('vehicleControllers', []);

vehicleControllers.controller('VehicleCtrl', ['$scope', 'Vehicle', function ($scope, Vehicle) {
        $scope.vehicles = Vehicle.query();
        
        // add mode
        $scope.onAddButtonClick = function (mode) {
            console.log(mode + ' Button Clicked');
            $('#addModalDialog').modal('show');

            console.log($scope.vehicles[0].registration_number);
        };
        
        // edit mode
        $scope.onEditButtonClick = function (index) {
            $('#editModalDialog').modal('show');
            
            $('h4.modal-title').text('Editing ' + $scope.vehicles[index].registration_number);
            $('#registrationNumberId').val($scope.vehicles[index].registration_number);
            $('#makeId').val($scope.vehicles[index].make);
            $('#modelId').val($scope.vehicles[index].model);
            $('#passengerSeatId').val($scope.vehicles[index].passenger_seat_number);

            console.log(index);
        };

        // save changes
        $scope.onSaveChangesButtonClicked = function (data) {
            var newVehicle = {
                'make' : 'Toyoto',
                'model' : 'Prius',
                'passenger_seat_number' : '5'
            };
            
            Vehicle.update({ registration_number: 'RN2222' } ,newVehicle);
            console.log('Save changes');
        }

}]);