'use strict'

/* Controllers */

var vehicleControllers = angular.module('vehicleControllers', []);

vehicleControllers.controller('VehicleCtrl', ['$scope', 'Vehicle', function ($scope, Vehicle) {
        $scope.vehicles = Vehicle.query();
        
        $scope.rowIndex = -1;
        
        /* SHOW ADD DIALOG */
        /* shows add modal dialog */
        $scope.onShowAddDialog = function (mode) {
            console.log(mode + ' Button Clicked');
            $('#addModalDialog').modal('show');

            console.log($scope.vehicles[0].registration_number);
        };
        
        /* SHOW EDIT DIALOG */
        /* shows edit modal dialog */
        $scope.onShowEditDialog = function (index) {
            $('#editModalDialog').modal('show');
            
            $('h4.modal-title').text('Editing ' + $scope.vehicles[index].registration_number);
            $('#editRegistrationNumberId').text($scope.vehicles[index].registration_number);
            $('#editMakeId').val($scope.vehicles[index].make);
            $('#editModelId').val($scope.vehicles[index].model);
            $('#editPassengerSeatId').val($scope.vehicles[index].passenger_seat_number);
            
            $scope.rowIndex = index;
            
            console.log('Editing row: ' + index);
        };
        
        /* SHOW REMOVE ALERT DIALOG */
        /* shows remove alert modal dialog */
        $scope.onShowRemoveDialog = function (index) {
            $('#removeModalDialog').modal('show');
            
            $('#removeRegistrationNumberId').text($scope.vehicles[index].registration_number);
            $('#removeMakeId').text($scope.vehicles[index].make);
            $('#removeModelId').text($scope.vehicles[index].model);
            $('#removePassengerSeatId').text($scope.vehicles[index].passenger_seat_number);
            
            $scope.rowIndex = index;

            console.log('Removing row: ' + index);
        };

        /* ADD ROW */
        /* add function invoked by Add button inside addModalDialog */
        $scope.onAddButtonClicked = function (data) {
            // get the user input
            var registrationNumber = $('#addRegistrationNumberId').val();
            var make = $('#addMakeId').val();
            var model = $('#addModelId').val();
            var passengerSeatNumber = $('#addPassengerSeatId').val();
            
            //var newVehicle = {
            //    'registration_number': registrationNumber,
            //    'make' : make,
            //    'model' : model,
            //    'passenger_seat_number' : passengerSeatNumber
            //};
            
            var newVehicle = {
                registration_number: registrationNumber,
                make : make,
                model : model,
                passenger_seat_number : passengerSeatNumber
            };

            // create a new vehicle 
            Vehicle.create(newVehicle);
            // hide the dialog
            $('#addModalDialog').on('hidden.bs.modal', function () {
                location.reload();
            })
        };
        
        
        /* SAVE CHANGES */
        /* A function invoked by Save Changes button inside Edit Modal Dialog */
        $scope.onSaveChangesButtonClicked = function (data) {
              
            // get the user input
            var registrationNumber = $('#editRegistrationNumberId').text();
            var make = $('#editMakeId').val();
            var model = $('#editModelId').val();
            var passengerSeatNumber = $('#editPassengerSeatId').val();
            
            //var updatedVehicle = {
            //    'make' : make,
            //    'model' : model,
            //    'passenger_seat_number' : passengerSeatNumber
            //};
            
            var updatedVehicle = {
                make: make,
                model: model,
                passenger_seat_number: passengerSeatNumber
            };

            //Vehicle.update({ registration_number: registrationNumber } , updatedVehicle);
            
            // check if there is any changes then reload the page
            if ($scope.rowIndex != -1) {
                if ($scope.vehicles[$scope.rowIndex].make != make || 
                $scope.vehicles[$scope.rowIndex].model != model || 
                $scope.vehicles[$scope.rowIndex].passenger_seat_number != passengerSeatNumber) {
                    // update the record
                    Vehicle.update({ registration_number: registrationNumber } , updatedVehicle);
                    // reset the temp variable
                    $scope.rowIndex = -1;
                    // on dialog hidden reload the page to show the changes
                    $('#editModalDialog').on('hidden.bs.modal', function () {
                        location.reload();
                    })
                }
            }
            
            

            console.log('Save changes');
        }
        
        
        /* REMOVE ROW */
        /* A function invoked by Remove button inside Remove Modal Dialog */
        $scope.onRemoveButtonClicked = function (index) {
            
            var registrationNumber = $scope.vehicles[$scope.rowIndex].registration_number;

            Vehicle.delete({ registration_number: registrationNumber });

            $('#removeModalDialog').on('hidden.bs.modal', function () {
                location.reload();
            })
        };
}]);