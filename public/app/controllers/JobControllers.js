'use strict';

var jobControllers = angular.module('jobControllers', ['jobServices', 'driverServices', 'geolocationServices', 'mapServices']);

jobControllers.controller('JobCtrl', ['$scope', 'Job', 'Driver', 'PostcodeLookupService', 'Location', 'Direction', function ($scope, Job, Driver, PostcodeLookupService, Location, Direction) {
        $scope.jobs = Job.query();
        $scope.drivers = Driver.query();

        var addDatePicker = $('#adddatetimepicker1').datetimepicker();
        var editDatePicker = $('#editdatetimepicker1').datetimepicker();
        
        var tempElementId = -1;
        var tempDriverId = -1;

        /* shows add modal dialog */
        $scope.onShowAddDialog = function (mode) {
            
            $('#addModalDialog').modal('show');
        };

        /* add a new record */
        $scope.onAddButtonClicked = function (data) {
            // get the user input
            var clientName = $('#addClientNameId').val();
            var description = $('#addDescriptionId').val();
            var fromAddress = $('#addFromAddressId').val();
            var fromPostCode = $('#addFromPostcodeId').val();
            var toAddress = $('#addToAddressId').val();
            var toPostCode = $('#addToPostcodeId').val();
            var phoneNumber = $('#addPhoneNumberId').val();            
            var time = addDatePicker.data("DateTimePicker").date().format();
            var id_driver = tempDriverId;
            
            //console.log(time);
            //console.log(clientName);
            //console.log(description);
            //console.log(fromAddress);
            //console.log(fromPostCode); 
            //console.log(toAddress); 
            //console.log(toPostCode); 
            //console.log(phoneNumber);
            //console.log(time);
                       
            var newJob = {
                client_name: clientName,
                description: description,
                from_address: fromAddress,
                from_postcode: fromPostCode,
                to_address: toAddress,
                to_postcode: toPostCode,
                phone_number: phoneNumber,
                time: time,
                id_driver: id_driver
            }
                         
            // create a new job 
            Job.create(newJob, function (response) {
                // will get job ID
                // create source locatoin
                // create dest location
                // create a new direction
                var idJob = response.responseBody.id_job;
                PostcodeLookupService.get({ postcode: fromPostCode }, function (responseForFrom) {
                    var fromLocation = {
                        description: fromPostCode,
                        latitude: responseForFrom.result.latitude,
                        longitude: responseForFrom.result.longitude
                    }
                    PostcodeLookupService.get({ postcode: toPostCode }, function (responseForTo) {
                        var toLocation = {
                            description: toPostCode,
                            latitude: responseForTo.result.latitude,
                            longitude: responseForTo.result.longitude
                        }
                        // from location
                        Location.create(fromLocation, function (fromLocationResponse) {
                            // to location
                            Location.create(toLocation, function (toLocationResponse) {
                                var requestBody = {
                                    id_job: idJob,
                                    src_id_location: fromLocationResponse.responseBody.id_location,
                                    dest_id_location: toLocationResponse.responseBody.id_location
                                }
                                Direction.create(requestBody, function (responseDirection) {
                                    console.log(responseDirection);
                                });
                            });
                        });
                    });
                    console.log(response.result);
                });

                console.log(response);
            });
            // hide the dialog
            $('#addModalDialog').on('hidden.bs.modal', function () {
                updateJobs();
            })
        };
        
        /* show edit dialog */
        $scope.onShowEditDialog = function (index) {
            $('#editModalDialog').modal('show');

            $('h4.modal-title').text('Editing the Job ID: ' + $scope.jobs[index].id_job);
            $('#editJobId').text($scope.jobs[index].id_job);
            $('#editClientNameId').val($scope.jobs[index].client_name);
            $('#editDescriptionId').val($scope.jobs[index].description);
            $('#editFromAddressId').val($scope.jobs[index].from_address);
            $('#editFromPostcodeId').val($scope.jobs[index].from_postcode);
            $('#editToAddressId').val($scope.jobs[index].to_address);
            $('#editToPostcodeId').val($scope.jobs[index].to_postcode);
            $('#editPhoneNumberId').val($scope.jobs[index].phone_number);
            var oldTime = $scope.jobs[index].time;
            
            editDatePicker.data("DateTimePicker").date(new Date(oldTime))
            $('#editDropdownTitle').text('Driver`s name');
            
        }
        
        /* save changes */
        $scope.onSaveChangesButtonClicked = function () {
            var idJob = $('#editJobId').text();
            var clientName = $('#editClientNameId').val();
            var description = $('#editDescriptionId').val();
            var fromAddress = $('#editFromAddressId').val();
            var fromPostCode = $('#editFromPostcodeId').val();
            var toAddress = $('#editToAddressId').val();
            var toPostCode = $('#editToPostcodeId').val();
            var phoneNumber = $('#editPhoneNumberId').val();
            var time = editDatePicker.data("DateTimePicker").date().format();
            var id_driver = tempDriverId;
            

            var updatedJob = {
                client_name: clientName,
                description: description,
                from_address: fromAddress,
                from_postcode: fromPostCode,
                to_address: toAddress,
                to_postcode: toPostCode,
                phone_number: phoneNumber,
                time: time,
                id_driver: id_driver
            }
            

            Job.update({ id_job: idJob }, updatedJob);
            // on dialog hidden reload the page to show the changes
            $('#editModalDialog').on('hidden.bs.modal', function () {
                updateJobs();
                
                // reset the temp variable
                tempElementId = -1;
                // driver ID
                tempDriverId = -1;
            })
            
        }
        
        /* show delete dialog */
        $scope.onShowRemoveDialog = function (index) {
            $('#removeModalDialog').modal('show');

            $('h4.modal-title').text('Editing the Job ID: ' + $scope.jobs[index].id_job);
            $('#jobId').text($scope.jobs[index].id_job);
            $('#clientNameId').text($scope.jobs[index].client_name);
            $('#descriptionId').text($scope.jobs[index].description);
            $('#fromAddressId').text($scope.jobs[index].from_address);
            $('#fromPostcodeId').text($scope.jobs[index].from_postcode);
            $('#toAddressId').text($scope.jobs[index].to_address);
            $('#toPostcodeId').text($scope.jobs[index].to_postcode);
            $('#phoneNumberId').text($scope.jobs[index].phone_number);
            
            $('#timeId').text($scope.jobs[index].time);
            //editDatePicker.data("DateTimePicker").date(new Date(oldTime))

            tempElementId = $scope.jobs[index].id_job;
        }
        
        /* A function invoked by Remove button inside Remove Modal Dialog */
        $scope.onDeleteButtonClicked = function (index) {
            
            Job.delete({ id_job: tempElementId });
            
            $('#removeModalDialog').on('hidden.bs.modal', function () {
                updateJobs();
            })
        };
        
        
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
        
        
        $scope.onDispatchJobButtonClicked = function (index) {
            console.log('Job Dispatched');
            console.log($scope.jobs[index]);
            var messageBody = {
                to_id_user_profile: $scope.jobs[index].driver.id_user_profile,
                job: $scope.jobs[index]
            }
            $scope.socket.emit('web:client:job:dispatch', messageBody);
        };

        var updateJobs = function () {
            $scope.jobs = Job.query();
        }
}]);