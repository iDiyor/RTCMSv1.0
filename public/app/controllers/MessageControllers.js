'use strict';

/* Controllers */

var messageControllers = angular.module('messageControllers', ['driverServices', 'messageServices']);

messageControllers.controller('MessageCtrl', ['$scope', '$stateParams', '$state', 'Driver', function ($scope, $stateParams, $state, Driver) {
        // should be an array of online drivers only
        $scope.onlineDrivers = Driver.query();
        

        $scope.goSomewhere = function (index) {
            $state.go('app.message.compose', {
                /*id_driver: $scope.onlineDrivers[index].id_driver*/
                /* can pass data only when defined as params - look at app.js */
                id_user_profile: $scope.onlineDrivers[index].userProfile.id_user_profile
            });
        }
}]);

messageControllers.controller('MessageComposeCtrl', ['$scope', '$stateParams', '$localStorage', '$q','Driver', 'Message', function ($scope, $stateParams, $localStorage, $q, Driver, Message) {
        
        var adminProfile = $localStorage.adminProfile;
        var adminUserProfileId = adminProfile.userProfile.id_user_profile;
        
        //var driverId = $stateParams.id_driver;
        var driverUserProfileId = $stateParams.id_user_profile;
        
        $scope.adminId = adminUserProfileId;
        $scope.driverId = driverUserProfileId;
        
        $scope.messages = [];

        console.log('AdminUserProfileID: ' + adminUserProfileId + ' | DriverProfileID: ' + driverUserProfileId);
        
        Message.getMessageToFrom({ to_id_user_profile: adminUserProfileId, from_id_user_profile: driverUserProfileId }, function (res1) {
            var array1 = res1;
            Message.getMessageToFrom({ to_id_user_profile: driverUserProfileId, from_id_user_profile: adminUserProfileId }, function (res2) {
                var array2 = res2;
                var array3 = array1.concat(array2);
                $scope.messages = array3;
            });
        });

        $scope.onSendButtonClicked = function () {
            var requestBody = {
                from_id_user_profile: adminUserProfileId,
                content: $scope.messageContent
            };
            Message.addMessageTo({ to_id_user_profile: driverUserProfileId }, requestBody, function (res) {
                // insert a message and update messages
                var message = res.responseBody
                $scope.messages.push(message);

                // clean input for next input
                $('#message_input').val('');
            });
        }
}]);
