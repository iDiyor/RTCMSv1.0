'use strict'

/* Controllers */

var vehicleControllers = angular.module('vehicleControllers', ['driverServices']);

vehicleControllers.controller('VehicleCtrl', ['$scope', 'Vehicle', 'Driver', function ($scope, Vehicle, Driver) {
        $scope.vehicles = Vehicle.query();
        // drivers only used to dropdown menu while assingning the vehicle to a driver
        $scope.drivers = Driver.query();
        
        $scope.rowIndex = -1;
        $scope.driverId = null;
        
        /* SHOW ADD DIALOG */
        /* shows add modal dialog */
        $scope.onShowAddDialog = function (mode) {
            console.log(mode + ' Button Clicked');
            $('#addModalDialog').modal('show');
        };
        
        /* SHOW EDIT DIALOG */
        /* shows edit modal dialog */
        $scope.onShowEditDialog = function (index) {
            $('#editModalDialog').modal('show');
            
            $('h4.modal-title').text('Editing ' + $scope.vehicles[index].id_registration_number);
            $('#editRegistrationNumberId').text($scope.vehicles[index].id_registration_number);
            $('#editMakeId').val($scope.vehicles[index].make);
            $('#editModelId').val($scope.vehicles[index].model);
            $('#editPassengerSeatId').val($scope.vehicles[index].passenger_seat_number);
            $('#editDropdownTitle').text($scope.vehicles[index].driver.first_name);

            $scope.rowIndex = index;
            /* added to save the driver`s id of the selected row. When no changes made to dropdown menu (inside edit dialog),
             when save changes button clicked it causes for a crash in the system becuase if initail null value of $scope.driverId */
            $scope.driverId = $scope.vehicles[index].driver.id_driver;
            
            console.log('Editing row: ' + index);
        };
        
        /* SHOW REMOVE ALERT DIALOG */
        /* shows remove alert modal dialog */
        $scope.onShowRemoveDialog = function (index) {
            $('#removeModalDialog').modal('show');
            
            $('#removeRegistrationNumberId').text($scope.vehicles[index].id_registration_number);
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
            var driverIdVar = $scope.driverId;
            
            var newVehicle = {
                id_registration_number: registrationNumber,
                make : make,
                model : model,
                passenger_seat_number : passengerSeatNumber,
                id_driver : driverIdVar
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
            var driverIdVar = $scope.driverId;

            var updatedVehicle = {
                make: make,
                model: model,
                passenger_seat_number: passengerSeatNumber,
                id_driver: driverIdVar
            };
            
            // check if there is any changes then reload the page
            //if ($scope.rowIndex != -1) {
                //if ($scope.vehicles[$scope.rowIndex].make != make || 
                //$scope.vehicles[$scope.rowIndex].model != model || 
                //$scope.vehicles[$scope.rowIndex].passenger_seat_number != passengerSeatNumber) {
                    // update the record
                    Vehicle.update({ id_registration_number: registrationNumber } , updatedVehicle);
                    // reset the temp variable
                    $scope.rowIndex = -1;
                    // driver ID
                    $scope.driverId = null;
                    // on dialog hidden reload the page to show the changes
                    $('#editModalDialog').on('hidden.bs.modal', function () {
                        location.reload();
                    })
                //}
            //}
            
            

            console.log('Save changes');
        }
        
        /* REMOVE ROW */
        /* A function invoked by Remove button inside Remove Modal Dialog */
        $scope.onRemoveButtonClicked = function (index) {
            
            var registrationNumber = $scope.vehicles[$scope.rowIndex].id_registration_number;

            Vehicle.delete({ id_registration_number: registrationNumber });

            $('#removeModalDialog').on('hidden.bs.modal', function () {
                location.reload();
            })
        };

        /* DROPDOWN MENU SELECT */
        /* Saves selected value of the dropdown menu */
        $scope.onDropdownMenuSelected = function (index, mode) {
            if (mode == 'add') {
                /* need to use $scope.drivers (instead vehicles[index].driver.first_name) 
                because dropdown will select only vehicles with drivesalready assigned not other available drivers */
                $('#addDropdownTitle').text($scope.drivers[index].userProfile.first_name); 
            }
            else if (mode == 'edit') {
                $('#editDropdownTitle').text($scope.drivers[index].userProfile.first_name);
            }
            $scope.driverId = $scope.drivers[index].id_driver;
            console.log('dropdown title ' + index  + ' ' + $scope.driverId );
        };
}]);