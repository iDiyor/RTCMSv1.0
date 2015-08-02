'use strict';

/* Controllers */

var driverControllers = angular.module('driverControllers', ['vehicleServices', 'userAccessServices']);

// Admin tab
driverControllers.controller('DriverCtrl', ['$scope', 'Driver', 'UserAuthenticateSrvc', function ($scope, Driver, UserAuthenticateSrvc) {
        $scope.drivers = Driver.query();

        // temp variables
        $scope.rowIndex = -1;
        //$scope.registrataionNumber = null;
        
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
            
            $('h4.modal-title').text('Editing ' + $scope.drivers[index].userProfile.first_name);
            $('#editDriverId').text($scope.drivers[index].id_driver);
            $('#editFirstNameId').val($scope.drivers[index].userProfile.first_name);
            $('#editMiddleNameId').val($scope.drivers[index].userProfile.middle_name);
            $('#editLastNameId').val($scope.drivers[index].userProfile.last_name);
            $('#editBODId').val($scope.drivers[index].userProfile.date_of_birth);
            $('#editPostCodeId').val($scope.drivers[index].userProfile.post_code);
            $('#editHouseNumberId').val($scope.drivers[index].userProfile.house_number);
            $('#editAddressLine1Id').val($scope.drivers[index].userProfile.address_line_1);
            $('#editAddressLine2Id').val($scope.drivers[index].userProfile.address_line_2);
            $('#editPhoneNumberId').val($scope.drivers[index].userProfile.phone_number);
            $('#editEmailId').val($scope.drivers[index].userProfile.email);
            $('#editDrivingLicenceNumberId').val($scope.drivers[index].document.driving_licence_number);
            //$('#editRegistrationNumberId').val($scope.drivers[index].vehicle_registration_number_fk);
            
            $scope.rowIndex = index;
            
            console.log('Editing row: ' + index);
        };
        
        /* SHOW REMOVE ALERT DIALOG */
        /* shows remove alert modal dialog */
        $scope.onShowRemoveDialog = function (index) {
            $('#removeModalDialog').modal('show');
            
            $('#driverId').text($scope.drivers[index].id_driver);
            $('#firstNameId').text($scope.drivers[index].userProfile.first_name);
            $('#middleNameId').text($scope.drivers[index].userProfile.middle_name);
            $('#lastNameId').text($scope.drivers[index].userProfile.last_name);
            $('#BODId').text($scope.drivers[index].userProfile.date_of_birth);
            $('#postCodeId').text($scope.drivers[index].userProfile.post_code);
            $('#houseNumberId').text($scope.drivers[index].userProfile.house_number);
            $('#addressLine1Id').text($scope.drivers[index].userProfile.address_line_1);
            $('#addressLine2Id').text($scope.drivers[index].userProfile.address_line_2);
            $('#phoneNumberId').text($scope.drivers[index].userProfile.phone_number);
            $('#emailId').text($scope.drivers[index].userProfile.email);
            $('#drivingLicenceNumberId').text($scope.drivers[index].document.driving_licence_number);
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
            var dateOfBirth = new Date(1992,1,1);//$('#addBODId').val();
            var postcode = $('#addPostCodeId').val();
            var houseNumber = $('#addHouseNumberId').val();
            var addressLine1 = $('#addAddressLine1Id').val();
            var addressLine2 = $('#addAddressLine2Id').val();
            var phoneNumber = $('#addPhoneNumberId').val();
            var email = $('#addEmailId').val();
            var drivingLicenceNumber = $('#addDrivingLicenceNumberId').val();
            //var vehicleRegistrationNumber = $scope.registrataionNumber;
            var username = $('#addUsernameId').val();
            var password = $('#addPasswordId').val();
            

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
            
            console.log(dateOfBirth);
            console.log(dateOfBirth.getTime());
            UserAuthenticateSrvc.DriverRegistration(username, password, 'driver', function (feedback) {
               
                var newUserProfile = {
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
                    id_role: feedback.id_role
                
                //vehicle_registration_number_fk: vehicleRegistrationNumber
                };
                // create a new driver 
                Driver.create(newUserProfile);
            });

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
           
            
            var updatedDriverProfile = {
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
            };
            
            if ($scope.rowIndex != -1) {
                Driver.update({ id_driver: driverId } , updatedDriverProfile, function (response) {
                    //console.log(response);
                    //if (response.responseStatus == 'success') {
                    //    alert('Record has been updated successfully');
                    //}
                });
                $scope.rowIndex = -1;

                $('#editModalDialog').on('hidden.bs.modal', function () {
                    location.reload();
                })
            }
            
            //Vehicle.update({ registration_number: registrationNumber } , updatedVehicle);
            
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
}]);