'use strict'

/* Controllers */

var vehicleControllers = angular.module('vehicleControllers', ['driverServices']);

vehicleControllers.controller('VehicleCtrl', ['$scope', 'Vehicle', 'Driver', function ($scope, Vehicle, Driver) {
        $scope.vehicles = Vehicle.query();
        // drivers only used to dropdown menu while assingning the vehicle to a driver
        $scope.drivers = Driver.query();
        
        var tempElementId = -1;
        var tempDriverId = -1;
        
        /* SHOW ADD DIALOG */
        /* shows add modal dialog */
        $scope.onShowAddDialog = function (mode) {

            $('#addModalDialog').modal('show');
        };
        
        /* ADD ROW */
        /* add function invoked by Add button inside addModalDialog */
        $scope.onAddButtonClicked = function (data) {
            // get the user input
            var registrationNumber = $('#addRegistrationNumberId').val();
            var make = $('#addMakeId').val();
            var model = $('#addModelId').val();
            var passengerSeatNumber = $('#addPassengerSeatId').val();
            var driverIdVar = tempDriverId;
            
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
                updateVehicle();
            })
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

            /* added to save the driver`s id of the selected row. When no changes made to dropdown menu (inside edit dialog),
             when save changes button clicked it causes for a crash in the system becuase if initail null value of $scope.driverId */
            tempDriverId = $scope.vehicles[index].driver.id_driver;
            
        };
        

        /* SAVE CHANGES */
        /* A function invoked by Save Changes button inside Edit Modal Dialog */
        $scope.onSaveChangesButtonClicked = function (data) {
            
            // get the user input
            var registrationNumber = $('#editRegistrationNumberId').text();
            var make = $('#editMakeId').val();
            var model = $('#editModelId').val();
            var passengerSeatNumber = $('#editPassengerSeatId').val();
            var driverIdVar = tempDriverId;
            
            var updatedVehicle = {
                make: make,
                model: model,
                passenger_seat_number: passengerSeatNumber,
                id_driver: driverIdVar
            };

            Vehicle.update({ id_registration_number: registrationNumber } , updatedVehicle);
            
            // on dialog hidden reload the page to show the changes
            $('#editModalDialog').on('hidden.bs.modal', function () {
                updateVehicle();

                // reset the temp variable
                tempElementId = -1;
                // driver ID
                tempDriverId = -1;
            })
        }

        /* SHOW REMOVE ALERT DIALOG */
        /* shows remove alert modal dialog */
        $scope.onShowRemoveDialog = function (index) {
            $('#removeModalDialog').modal('show');
            
            $('#removeRegistrationNumberId').text($scope.vehicles[index].id_registration_number);
            $('#removeMakeId').text($scope.vehicles[index].make);
            $('#removeModelId').text($scope.vehicles[index].model);
            $('#removePassengerSeatId').text($scope.vehicles[index].passenger_seat_number);
            
            tempElementId = $scope.vehicles[index].id_registration_number;

        };

        /* REMOVE ROW */
        /* A function invoked by Remove button inside Remove Modal Dialog */
        $scope.onRemoveButtonClicked = function (index) {
            
            Vehicle.delete({ id_registration_number: tempElementId });

            $('#removeModalDialog').on('hidden.bs.modal', function () {
                updateVehicle();
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
            tempDriverId = $scope.drivers[index].id_driver;
        };

        var updateVehicle = function () {
            $scope.vehicles = Vehicle.query();
        }
}]);