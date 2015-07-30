'use strict';

/* Controllers */

var driverControllers = angular.module('driverControllers', ['vehicleServices']);

// Admin tab
driverControllers.controller('DriverCtrl', ['$scope', 'Driver', function ($scope, Driver) {
        $scope.drivers = Driver.query();
        
       
        // temp variables
        $scope.rowIndex = -1;
        //$scope.registrataionNumber = null;
        
        /* SHOW ADD DIALOG */
        /* shows add modal dialog */
        $scope.onShowAddDialog = function (mode) {
            console.log(mode + ' Button Clicked');
            $('#addModalDialog').modal('show');
            
            console.log($scope.drivers[0].first_name);
        };
        
        /* SHOW EDIT DIALOG */
        /* shows edit modal dialog */
        $scope.onShowEditDialog = function (index) {
            $('#editModalDialog').modal('show');
            
            $('h4.modal-title').text('Editing ' + $scope.drivers[index].registration_number);
            $('#editDriverId').text($scope.drivers[index].id_driver);
            $('#editFirstNameId').val($scope.drivers[index].first_name);
            $('#editMiddleNameId').val($scope.drivers[index].middle_name);
            $('#editLastNameId').val($scope.drivers[index].last_name);
            $('#editBODId').val($scope.drivers[index].date_of_birth);
            $('#editPostCodeId').val($scope.drivers[index].post_code);
            $('#editHouseNumberId').val($scope.drivers[index].house_number);
            $('#editAddressLine1Id').val($scope.drivers[index].address_line_1);
            $('#editAddressLine2Id').val($scope.drivers[index].address_line_2);
            $('#editPhoneNumberId').val($scope.drivers[index].phone_number);
            $('#editEmailId').val($scope.drivers[index].email);
            $('#editDrivingLicenceNumberId').val($scope.drivers[index].driving_licence_number);
            //$('#editRegistrationNumberId').val($scope.drivers[index].vehicle_registration_number_fk);
            
            $scope.rowIndex = index;
            
            console.log('Editing row: ' + index);
        };
        
        /* SHOW REMOVE ALERT DIALOG */
        /* shows remove alert modal dialog */
        $scope.onShowRemoveDialog = function (index) {
            $('#removeModalDialog').modal('show');
            
            $('#driverId').text($scope.drivers[index].id_driver);
            $('#firstNameId').text($scope.drivers[index].first_name);
            $('#middleNameId').text($scope.drivers[index].middle_name);
            $('#lastNameId').text($scope.drivers[index].last_name);
            $('#BODId').text($scope.drivers[index].date_of_birth);
            $('#postCodeId').text($scope.drivers[index].post_code);
            $('#houseNumberId').text($scope.drivers[index].house_number);
            $('#addressLine1Id').text($scope.drivers[index].address_line_1);
            $('#addressLine2Id').text($scope.drivers[index].address_line_2);
            $('#phoneNumberId').text($scope.drivers[index].phone_number);
            $('#emailId').text($scope.drivers[index].email);
            $('#drivingLicenceNumberId').text($scope.drivers[index].driving_licence_number);
            $('#registrationNumberId').text($scope.drivers[index].vehicle.id_registration_number);
            //$('#registrationNumberId').text($scope.drivers[index].vehicle_registration_number_fk);
            
            $scope.rowIndex = index;
            
            console.log('Removing row: ' + index);
        };
        
        /* ADD ROW */
        /* add function invoked by Add button inside addModalDialog */
        $scope.onAddButtonClicked = function (data) {
            // get the user input
            var firstName = $('#addFirstNameId').val();
            var middleName = $('#addMiddleNameId').val();
            var lastName = $('#addLastNameId').val();
            var dateOfBirth = $('#addBODId').val();
            var postcode = $('#addPostCodeId').val();
            var houseNumber = $('#addHouseNumberId').val();
            var addressLine1 = $('#addAddressLine1Id').val();
            var addressLine2 = $('#addAddressLine2Id').val();
            var phoneNumber = $('#addPhoneNumberId').val();
            var email = $('#addEmailId').val();
            var drivingLicenceNumber = $('#addDrivingLicenceNumberId').val();
            //var vehicleRegistrationNumber = $scope.registrataionNumber;

            //var newDriver = {
            //    'first_name': firstName,
            //    'middle_name': middleName,
            //    'last_name': lastName,
            //    'date_of_birth': dateOfBirth,
            //    'post_code': postcode,
            //    'house_number': houseNumber,
            //    'address_line_1': addressLine1,
            //    'address_line_2': addressLine2,
            //    'phone_number': phoneNumber,
            //    'email': email,
            //    'driving_licence_number': drivingLicenceNumber,
            //    'vehicle_registration_number_fk': vehicleRegistrationNumber
            //};
            
            
            var newDriver = {
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                post_code: postcode,
                house_number: houseNumber,
                address_line_1: addressLine1,
                address_line_2: addressLine2,
                phone_number: phoneNumber,
                email: email,
                driving_licence_number: drivingLicenceNumber,
                //vehicle_registration_number_fk: vehicleRegistrationNumber
            };
            // create a new driver 
            Driver.create(newDriver);
            // registration number nill for next reuse
            //$scope.registrataionNumber = null;
            // hide the dialog
            $('#addModalDialog').on('hidden.bs.modal', function () {
                location.reload();
            })
        };
        
        
        /* SAVE CHANGES */
        /* A function invoked by Save Changes button inside Edit Modal Dialog */
        $scope.onSaveChangesButtonClicked = function (data) {
            
            // get the user input
            var driverId = $('#editDriverId').text();
            var firstName = $('#editFirstNameId').val();
            var middleName = $('#editMiddleNameId').val();
            var lastName = $('#editLastNameId').val();
            var dateOfBirth = $('#editBODId').val();
            var postcode = $('#editPostCodeId').val();
            var houseNumber = $('#editHouseNumberId').val();
            var addressLine1 = $('#editAddressLine1Id').val();
            var addressLine2 = $('#editAddressLine2Id').val();
            var phoneNumber = $('#editPhoneNumberId').val();
            var email = $('#editEmailId').val();
            var drivingLicenceNumber = $('#editDrivingLicenceNumberId').val();
            //var vehicleRegistrationNumber = null;
            //if ($scope.registrataionNumber != null)
            //    vehicleRegistrationNumber = $scope.registrataionNumber;
            
            //var updatedDriver = {
            //    'first_name': firstName,
            //    'middle_name': middleName,
            //    'last_name': lastName,
            //    'date_of_birth': dateOfBirth,
            //    'post_code': postcode,
            //    'house_number': houseNumber,
            //    'address_line_1': addressLine1,
            //    'address_line_2': addressLine2,
            //    'phone_number': phoneNumber,
            //    'email': email,
            //    'driving_licence_number': drivingLicenceNumber,
            //    'vehicle_registration_number_fk': vehicleRegistrationNumber
            //};
            
            var updatedDriver = {
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                post_code: postcode,
                house_number: houseNumber,
                address_line_1: addressLine1,
                address_line_2: addressLine2,
                phone_number: phoneNumber,
                email: email,
                driving_licence_number: drivingLicenceNumber,
                //vehicle_registration_number_fk: vehicleRegistrationNumber
            };
            
            //Vehicle.update({ registration_number: registrationNumber } , updatedVehicle);
            
            // check if there is any changes then reload the page
            if ($scope.rowIndex != -1) {
                //if ($scope.drivers[$scope.rowIndex].make != make || 
                //$scope.vehicles[$scope.rowIndex].model != model || 
                //$scope.vehicles[$scope.rowIndex].passenger_seat_number != passengerSeatNumber) {
                    // update the record
                    Driver.update({ id_driver: driverId } , updatedDriver);
                    // set $scope.registrationNumber to null for next use
                    $scope.registrataionNumber = null;
                    // reset the temp variable
                    $scope.rowIndex = -1;
                    // on dialog hidden reload the page to show the changes
                    $('#editModalDialog').on('hidden.bs.modal', function () {
                        location.reload();
                    })
                //}
            }
            
            
            
            console.log('Save changes');
        }
        
        
        /* REMOVE ROW */
        /* A function invoked by Remove button inside Remove Modal Dialog */
        $scope.onRemoveButtonClicked = function (index) {
            
            var driverId = $scope.drivers[$scope.rowIndex].id_driver;
            
            Driver.delete({ id_driver: driverId });
            
            $('#removeModalDialog').on('hidden.bs.modal', function () {
                location.reload();
            })
        };


        /* DROPDOWN MENU SELECT */
        /* Saves selected value of the dropdown menu */
        //$scope.onDropdownMenuSelected = function (index) {
        //    $('#dropdownTitle').text($scope.vehicles[index].registration_number);
        //    $scope.registrataionNumber = $scope.vehicles[index].registration_number;
        //};
}]);