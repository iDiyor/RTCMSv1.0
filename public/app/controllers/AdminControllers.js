'use strict';

var adminControllers = angular.module('adminControllers', ['userAccessServices']);

adminControllers.controller('AdminCtrl', ['$scope', '$localStorage', 'AdminService', 'UserAuthenticateService', function ($scope, $localStorage, AdminService, UserAuthenticateService) {
        $scope.admins = AdminService.query();      
        
        // a temp varaiable used while deleting a record
        var tempElementId = -1;

        // show dialog
        $scope.onShowAddDialog = function () {
            $('#addModalDialog').modal('show');
        };
        
        // add a new admin profile
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
            
            var username = $('#addUsernameId').val();
            var password = $('#addPasswordId').val();
            
            // admin registration
            UserAuthenticateService.UserRegistration(username, password, 'admin', function (feedback) {
                
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
                    id_role: feedback.id_role
                };
                // create a new admin 
                AdminService.create(newUserProfile);
            });
            
            // hide the dialog
            $('#addModalDialog').on('hidden.bs.modal', function () {
                updateAdmins();
            })
        };
        
        // show edit dialog
        $scope.onShowEditDialog = function (index) {
            $('#editModalDialog').modal('show');

            $('#editAdminId').text($scope.admins[index].id_admin);
            $('#editFirstNameId').val($scope.admins[index].userProfile.first_name);
            $('#editMiddleNameId').val($scope.admins[index].userProfile.middle_name);
            $('#editLastNameId').val($scope.admins[index].userProfile.last_name);
            $('#editBODId').val($scope.admins[index].userProfile.date_of_birth);
            $('#editPostCodeId').val($scope.admins[index].userProfile.post_code);
            $('#editHouseNumberId').val($scope.admins[index].userProfile.house_number);
            $('#editAddressLine1Id').val($scope.admins[index].userProfile.address_line_1);
            $('#editAddressLine2Id').val($scope.admins[index].userProfile.address_line_2);
            $('#editPhoneNumberId').val($scope.admins[index].userProfile.phone_number);
            $('#editEmailId').val($scope.admins[index].userProfile.email);
        };
        
        // save changes on selected row
        $scope.onSaveChangesButtonClicked = function () {
            
            // get the user input
            var adminId = $('#editAdminId').text();
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
            
            var newAdmin = {
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                post_code: postcode,
                house_number: houseNumber,
                address_line_1: addressLine1,
                address_line_2: addressLine2,
                phone_number: phoneNumber,
                email: email
            };
            
            AdminService.update({ id_admin: adminId } , newAdmin, function (response) {
                if (response.responseStatus == 'success') {
                    updateAdmins();
                }
            });
        }
        
        // show delete dialog
        $scope.onShowRemoveDialog = function (index) {
            $('#removeModalDialog').modal('show');
            
            $('#adminId').text($scope.admins[index].id_admin);
            $('#firstNameId').text($scope.admins[index].userProfile.first_name);
            $('#middleNameId').text($scope.admins[index].userProfile.middle_name);
            $('#lastNameId').text($scope.admins[index].userProfile.last_name);
            $('#BODId').text($scope.admins[index].userProfile.date_of_birth);
            $('#postCodeId').text($scope.admins[index].userProfile.post_code);
            $('#houseNumberId').text($scope.admins[index].userProfile.house_number);
            $('#addressLine1Id').text($scope.admins[index].userProfile.address_line_1);
            $('#addressLine2Id').text($scope.admins[index].userProfile.address_line_2);
            $('#phoneNumberId').text($scope.admins[index].userProfile.phone_number);
            $('#emailId').text($scope.admins[index].userProfile.email);

            tempElementId = $scope.admins[index].id_admin;
        }
        
        // delete the selected row
        $scope.onDeleteButtonClicked = function () {
            
            AdminService.delete({ id_admin: tempElementId }, function (response) {
                tempElementId = -1;
            });

            $('#removeModalDialog').on('hidden.bs.modal', function () {
                updateAdmins();
            })
            
        }
        var updateAdmins = function () {
            $scope.admins = AdminService.query();
        }
}]);